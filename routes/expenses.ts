import express from "express";
import {
  deletedExpense,
  getExpense,
  getExpenses,
  postExpense,
} from "../controllers/expenseController";
import validateObjectId from "../middleware/validateObjectId";

const router = express.Router();

router.get("/", getExpenses);

router.get("/:id", validateObjectId("Genre"), getExpense);

router.post("/", postExpense);

router.delete("/:id", validateObjectId("Genre"), deletedExpense);

export default router;
