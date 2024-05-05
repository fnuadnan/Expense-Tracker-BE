"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expenseController_1 = require("../controllers/expenseController");
const validateId_1 = __importDefault(require("../middleware/validateId"));
const router = express_1.default.Router();
router.get("/", expenseController_1.getExpenses);
router.get("/:id", (0, validateId_1.default)("Genre"), expenseController_1.getExpense);
router.post("/", expenseController_1.postExpense);
router.delete("/:id", (0, validateId_1.default)("Genre"), expenseController_1.deletedExpense);
exports.default = router;
