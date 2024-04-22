import express from "express";
import mongoose from "mongoose";
import expenses from "./routes/expenses";
const app = express();

// database connection
mongoose
  .connect("mongodb://localhost:27017/expense tracker")
  .then(() => console.log("Connecting to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

//routes
app.use('/api/expenses/', expenses);

// listenner
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listenning to port ${port}`));
