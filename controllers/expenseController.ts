import { Request, Response } from "express";
import { IExpense } from "../entities/IExpense";
import { Expense, validateExpense } from "../models/Expense";
import { User } from "../models/User";

// get all expenses
const getExpenses = async (req: Request, res: Response) => {
  // if the user is authenticated, get only their expenses
  if (req.user) {
    try {
      const expenses = await Expense.find({ "user._id": req.user._id });
      return res.send(expenses);
    } catch (error) {
      console.error({ message: "Error getting the expenses:", error });
      return res
        .status(500)
        .send({ message: "Failed to get the expenses", error: error });
    }
  }

  // get all expenses without filtering by users
  try {
    const expenses = await Expense.find({ user: { $exists: false } });
    res.send(expenses);
  } catch (error) {
    console.error({ message: "Error getting the expenses:", error });
    res
      .status(500)
      .send({ message: "Failed to get the expenses", error: error });
  }
};

// get a single expense
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

// create a new expense
const postExpense = async (req: Request, res: Response) => {
  // Validate the expense data
  const result = validateExpense(req.body);
  if (!result.success) {
    return res
      .status(400)
      .send({ message: "Validation failed", errors: result.error });
  }

  // basic expense data
  let expenseData: IExpense = {
    description: req.body.description,
    amount: req.body.amount,
    category: req.body.category,
  };

  // if authenticated, add the user data to the expense
  if (req.user) {
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        expenseData.user = {
          _id: user._id,
          name: user.name,
          email: user.email,
        };
      } else {
        return res.status(404).send({ message: "Could not process the user" });
      }
    } catch (error) {
      console.error("Error fetching user from database:", error);
      return res
        .status(500)
        .send({ message: "Failed to get the user with the given ID", error });
    }
  }

  // Create and save the new expense
  try {
    const expense = new Expense(expenseData);
    await expense.save();
    res.status(201).send(expense);
  } catch (error) {
    console.error({
      message: `Error creating the expense ${
        req.user ? "with" : "without"
      } user:`,
      error,
    });
    res.status(500).send({ message: "Failed to create the expense", error });
  }
};

// delete an expense
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
