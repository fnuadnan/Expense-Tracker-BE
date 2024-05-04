import express from "express";
import {
  deletedExpense,
  getExpense,
  getExpenses,
  postExpense,
} from "../controllers/expenseController";

const router = express.Router();

router.get("/", getExpenses);

router.get("/:id", getExpense);

router.post("/", postExpense);

router.delete("/:id", deletedExpense);

export default router;
