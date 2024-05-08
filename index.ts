import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import expenses from "./routes/expenses";

dotenv.config();
const app = express();

// database connection

if (!process.env.DB_TEST) {
  console.error("FATAL ERROR: DB is not defined.");
  process.exit(1);
}

mongoose
  .connect(process.env.DB_TEST)
  .then(() => console.log("Connecting to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

// middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/api/expenses/", expenses);

// listenner
const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`Listenning to port ${port}`)
);
export default server;
