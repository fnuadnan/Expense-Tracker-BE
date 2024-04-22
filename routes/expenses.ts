import express from "express";
import mongoose from "mongoose";
import { Expense, IExpense, validateExpense } from "../models/Expense";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.send(expenses);
  } catch (error) {
    console.error("Error retrieving expenses:", error);
    res
      .status(500)
      .send({ message: "Failed to retrieve expenses from the server." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).send("Invalid expense ID");

    const expense = await Expense.findById({ _id: req.params.id });

    if (!expense) return res.status(404).send("The expense with the given ID was not found");

    res.send(expense);
  } catch (error) {
    console.error({ message: "Error getting the expense:", error });
    res
      .status(500)
      .send({ message: "Failed to get the expense", error: error });
  }
});

router.post("/", async (req, res) => {
  try {
    const result = validateExpense(req.body);
    if (!result.success)
      return res
        .status(400)
        .send({ message: "Validation failed", errors: result.error });

    const expense = new Expense<IExpense>({
      description: req.body.description,
      amount: req.body.amount,
      category: req.body.category,
    });
    await expense.save();

    res.send(expense);
  } catch (error) {
    console.error("Error posting expense:", error);
    res.status(500).send({ message: "Failed to post expense to the server." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).send("Invalid expense ID");

    // attempt to delete
    const expense = await Expense.findOneAndDelete({ _id: req.params.id });

    // check if the expense exists
    if (!expense) return res.status(404).send("The expense with the given ID was not found");

    res.send({
      message: "Expense deleted successfully",
      deletedExpense: expense,
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).send({ message: "Failed to delete expense", error: error });
  }
});

export default router;
