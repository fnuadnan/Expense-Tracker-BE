import { Request, Response } from "express";
import { Expense, IExpense, validateExpense } from "../models/Expense";

const getExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.find();
    res.send(expenses);
  } catch (error) {
    console.error({ message: "Error getting the expenses:", error });
    res
      .status(500)
      .send({ message: "Failed to get the expenses", error: error });
  }
};

const getExpense = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense)
      return res
        .status(404)
        .send("The expense with the given ID was not found");

    res.send(expense);
  } catch (error) {
    console.error({ message: "Error getting the expense:", error });
    res
      .status(500)
      .send({ message: "Failed to get the expense", error: error });
  }
};

const postExpense = async (req: Request, res: Response) => {
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
    console.error({ message: "Error creating the expense:", error });
    res
      .status(500)
      .send({ message: "Failed to create the expense", error: error });
  }
};

const deletedExpense = async (req: Request, res: Response) => {
  try {
    // attempt to delete
    const expense = await Expense.findOneAndDelete({ _id: req.params.id });

    // check if the expense exists
    if (!expense)
      return res
        .status(404)
        .send("The expense with the given ID was not found");

    res.send({
      message: "Expense deleted successfully",
      deletedExpense: expense,
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).send({ message: "Failed to delete expense", error: error });
  }
};

export { deletedExpense, getExpense, getExpenses, postExpense };
