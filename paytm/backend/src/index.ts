import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import { User } from "./db";
// since export default so doesn't matter whatever name is given
import mainRouter from "./routes/index";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1", mainRouter);
config();

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_ID}:${process.env.MONGO_PASS}@paytm-cluster.tflod.mongodb.net/paytmClone`
);

app.listen(3000, () => {
  console.log("server running at port 3000");
});
