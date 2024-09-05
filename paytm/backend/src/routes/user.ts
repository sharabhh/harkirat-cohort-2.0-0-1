import express from "express";
import { User } from "../db";
import zod from "zod";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { Request, Response, NextFunction } from "express";
import authMiddleware from "../middleware";
import { json } from "stream/consumers";
import { Account } from "../db";

const router = express.Router();

const signupBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

interface ReqIdAddOn extends Request {
  userId?: string;
}

router.post("/signup", async (req, res) => {
  try {
    const { success } = signupBody.safeParse(req.body);

    if (!success) {
      return res
        .status(411)
        .json({ msg: "email already exists / invalid params" });
    }

    const existingUser = await User.findOne({ username: req.body.username });

    if (existingUser) {
      return res
        .status(411)
        .json({ msg: "user already exists / invaldi params" });
    }

    const firstName: String = req.body.firstName;
    const lastName: String = req.body.lastName;
    const username: String = req.body.username;
    const password: String = req.body.password;

    const dataObj = { firstName, lastName, username, password };

    const user = await User.create(dataObj);

    const userId = user._id;
    const token = jwt.sign({ userId }, JWT_SECRET);

    // give a random balance to the user
    await Account.create({
      userId,
      balance: 1 + Math.random() * 10000
    })

    res.json({ msg: "user created", token: token });
  } catch (e) {
    console.log(e);
  }
});

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({ msg: "Incorrect inputs" });
  }

  const username = req.body.username;
  const password = req.body.password;

  const user = await User.findOne({ username, password });

  if (!user) {
    return res.status(411).json({ msg: "Error while logging in" });
  }
  const userId = user._id;
  const token = jwt.sign({ userId }, JWT_SECRET);

  res.status(200).json({ msg: "signed in", token });
});

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.put("/", authMiddleware, async (req: ReqIdAddOn, res: Response) => {
  const { success } = updateBody.safeParse(req.body);

  if (!success) {
    return res.status(401).json({ msg: "Unauthorized access" });
  }

  await User.updateOne({ _id: req.userId }, req.body);

  res.json({
    msg: "update succesful",
  });
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: (await users).map(user => ({
        username: user.username,
        firstname: user.firstName,
        lastname: user.lastName,
        _id: user._id
    }))
  })
});

export default router;
