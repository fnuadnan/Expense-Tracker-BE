import express from "express";
import {
  deletedExpense,
  getExpense,
  getExpenses,
  postExpense,
} from "../controllers/expenseController";
import validateId from "../middleware/validateId";

const router = express.Router();

router.get("/", getExpenses);

router.get("/:id", validateId("Genre"), getExpense);

// Route for unauthenticated users
router.post("/", postExpense);

router.delete("/:id", validateId("Genre"), deletedExpense);

export default router;
