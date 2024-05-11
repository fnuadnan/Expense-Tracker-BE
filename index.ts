import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import auth from "./routes/auth";
import expenses from "./routes/expenses";
import users from "./routes/users";

dotenv.config();
const app = express();

// database connection
if (!process.env.DB) {
  console.error("FATAL ERROR: DB is not defined.");
  process.exit(1);
}
mongoose
  .connect(process.env.DB)
  .then(() => console.log("Connecting to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

// middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/api/expenses/", expenses);
app.use("/api/users/", users);
app.use("/api/auth/", auth);

// listenner
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listenning to port ${port}`));
