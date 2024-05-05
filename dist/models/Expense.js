"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateExpense = exports.Expense = exports.expenseSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
// schema
const expenseSchema = new mongoose_1.default.Schema({
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
exports.expenseSchema = expenseSchema;
// model
const Expense = mongoose_1.default.model("Expense", expenseSchema);
exports.Expense = Expense;
// validation
function validateExpense(expense) {
    const schema = zod_1.z.object({
        description: zod_1.z.string().min(3),
        amount: zod_1.z
            .number({ invalid_type_error: "Amount is required" })
            .min(1, { message: "Amount must be greater or equal to 1$" }),
        category: zod_1.z.enum(["Utilities", "Groceries", "Entertainment"], {
            errorMap: () => ({ message: "Category is required" }),
        }),
    });
    return schema.safeParse(expense);
}
exports.validateExpense = validateExpense;
