import mongoose from "mongoose";
import { z } from "zod";

// Expense type and interface
type Category = "Entertainment" | "Utilities" | "Groceries";
interface IExpense {
  description: string;
  amount: number;
  category: Category;
}

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

export {IExpense, expenseSchema, Expense, validateExpense};
