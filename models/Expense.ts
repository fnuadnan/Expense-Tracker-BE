import mongoose from "mongoose";

// schema
const expenseSchema = new mongoose.Schema({
	description: {},
	amount: {},
	category: {}
});

// model
const Expense = mongoose.model('Expense', expenseSchema);

// validation
function validateExpense() {

};

export {};