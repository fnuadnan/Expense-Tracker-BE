import mongoose from "mongoose";
import { z } from "zod";
import { IExpense } from "../entities/IExpense";

// schema
const expenseSchema = new mongoose.Schema<IExpense>({
  description: {
    type: String,
    minlength: 3,
    required: true,
  },
  amount: {
    type: Number,
    min: 1,
    required: true,
  },
  category: {
    type: String,
    enum: ["Entertainment", "Utilities", "Groceries"],
    required: true,
  },
  user: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
      },
      email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: false,
      },
    }),
  },
});

// model
const Expense = mongoose.model<IExpense>("Expense", expenseSchema);

// validation
function validateExpense(expense: IExpense) {
  const schema = z.object({
    description: z.string().min(3),
    amount: z
      .number({ invalid_type_error: "Amount is required" })
      .min(1, { message: "Amount must be greater or equal to 1$" }),
    category: z.enum(["Utilities", "Groceries", "Entertainment"], {
      errorMap: () => ({ message: "Category is required" }),
    }),
  });
  return schema.safeParse(expense);
}

export { Expense, expenseSchema, IExpense, validateExpense };
