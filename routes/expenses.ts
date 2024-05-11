import express from "express";
import {
  deletedExpense,
  getExpense,
  getExpenses,
  postExpense,
} from "../controllers/expenseController";
import validateId from "../middleware/validateId";
import verifyToken from "../middleware/verifyToken";

const router = express.Router();

router.get("/", verifyToken, getExpenses);

router.get("/:id", validateId("Genre"), getExpense);

// Apply verifyToken but it's non-blocking for unauthenticated users
// Single route handling both authenticated and unauthenticated users
router.post("/", verifyToken, postExpense);

router.delete("/:id", validateId("Genre"), deletedExpense);

export default router;
