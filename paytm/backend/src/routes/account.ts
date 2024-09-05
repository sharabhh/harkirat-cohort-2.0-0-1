import express, { Request, Response } from "express";
import authMiddleware from "../middleware";
import { Account } from "../db";
const router = express.Router();
import zod from "zod";

interface ReqIdAddOn extends Request {
  userId?: string;
}

router.get(
  "/balance",
  authMiddleware,
  async (req: ReqIdAddOn, res: Response) => {
    try {
      const fetchUserAccount = await Account.findOne({ userId: req.userId });
      // res.json({balance: req.userId})
      res.json({ balance: fetchUserAccount?.balance });
    } catch (e) {
      console.log(e);

      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

const transferMoneyValidate = zod.object({
  to: zod.string(),
  amount: zod.number(),
});
router.post(
  "/transfer",
  authMiddleware,
  async (req: ReqIdAddOn, res: Response) => {
    try {
      const { success } = transferMoneyValidate.safeParse(req.body);
      if (!success) {
        return res.json({ msg: "invalid params" });
      }

      const { to, amount } = req.body;
      const fetchUserBalance = await Account.findOne({ userId: req.userId });

      // res.json(fetchUserBalance?.balance)
      const accountBalance = fetchUserBalance?.balance;
      // res.json(accountBalance)

      if (!accountBalance) {
        return res.json({ msg: "wallet not found" });
      }

      if (accountBalance < amount) {
        return res.status(400).json({ msg: "insufficient funds" });
      }
      res.json({ msg: "money sent" });
    } catch (e) {
      console.log(e);
    }
  }
);

export default router;
