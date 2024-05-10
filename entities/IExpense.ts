import { IUser } from "./IUser";

export type Category = "Entertainment" | "Utilities" | "Groceries";
export interface IExpense {
  _id?: string;
  description: string;
  amount: number;
  category: Category;
  user?: Pick<IUser, "_id" | "email" | "name">; // pick only the email and name properties from IUser
}
