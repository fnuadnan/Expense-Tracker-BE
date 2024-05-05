"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postExpense = exports.getExpenses = exports.getExpense = exports.deletedExpense = void 0;
const Expense_1 = require("../models/Expense");
const getExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expenses = yield Expense_1.Expense.find();
        res.send(expenses);
    }
    catch (error) {
        console.error({ message: "Error getting the expenses:", error });
        res
            .status(500)
            .send({ message: "Failed to get the expenses", error: error });
    }
});
exports.getExpenses = getExpenses;
const getExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expense = yield Expense_1.Expense.findById(req.params.id);
        if (!expense)
            return res
                .status(404)
                .send("The expense with the given ID was not found");
        res.send(expense);
    }
    catch (error) {
        console.error({ message: "Error getting the expense:", error });
        res
            .status(500)
            .send({ message: "Failed to get the expense", error: error });
    }
});
exports.getExpense = getExpense;
const postExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = (0, Expense_1.validateExpense)(req.body);
        if (!result.success)
            return res
                .status(400)
                .send({ message: "Validation failed", errors: result.error });
        const expense = new Expense_1.Expense({
            description: req.body.description,
            amount: req.body.amount,
            category: req.body.category,
        });
        yield expense.save();
        res.send(expense);
    }
    catch (error) {
        console.error({ message: "Error creating the expense:", error });
        res
            .status(500)
            .send({ message: "Failed to create the expense", error: error });
    }
});
exports.postExpense = postExpense;
const deletedExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // attempt to delete
        const expense = yield Expense_1.Expense.findOneAndDelete({ _id: req.params.id });
        // check if the expense exists
        if (!expense)
            return res
                .status(404)
                .send("The expense with the given ID was not found");
        res.send({
            message: "Expense deleted successfully",
            deletedExpense: expense,
        });
    }
    catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).send({ message: "Failed to delete expense", error: error });
    }
});
exports.deletedExpense = deletedExpense;
