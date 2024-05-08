import mongoose from "mongoose";
import request from "supertest";
import server from "../../index";
import { Expense } from "../../models/Expense";

describe("/api/expenses ", () => {
  afterEach(async () => {
    await Expense.deleteMany({});
  });

  // getting all the expenses
  describe("GET /", () => {
    it("should return all expenses", async () => {
      await Expense.collection.insertMany([
        { description: "description 1", amount: 21, category: "Entertainment" },
        { description: "description 2", amount: 22, category: "Utility" },
      ]);

      const res = await request(server).get("/api/expenses");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(
        res.body.some(
          (g: { description: string }) => g.description == "description 1"
        )
      ).toBeTruthy();
      expect(
        res.body.some((g: { amount: number }) => g.amount == 21)
      ).toBeTruthy();
    });
  });

  // getting by id
  describe("GET /:id", () => {
    it("should return 404 if no expense with the given id was found", async () => {
      const id = mongoose.Types.ObjectId;

      const res = await request(server).get(`/api/expenses/${id}`);

      expect(res.status).toBe(404);
    });

    it("should return an expense if a valid id is passed", async () => {
      const expense = new Expense({
        description: "expense",
        amount: 11,
        category: "Utilities",
      });
      await expense.save();

      const res = await request(server).get(`/api/expenses/${expense._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("amount", expense.amount);
    });
  });

  // posting and expense
  describe("POST /", () => {
    it("should return 400 if expense body is invalid", async () => {
      const res = await request(server)
        .post("/api/expenses")
        .send({ description: "", amount: 0, category: "" });

      expect(res.status).toBe(400);
    });

    it("should save the expense if it is valid", async () => {
      const res = await request(server).post("/api/expenses").send({
        description: "description 1",
        amount: 21,
        category: "Entertainment",
      });

      const expense = await Expense.find({ amount: 21 });

      expect(expense).not.toBeNull();
    });

    it("should return the expense if it is valid", async () => {
      const res = await request(server).post("/api/expenses").send({
        description: "description 1",
        amount: 21,
        category: "Entertainment",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("amount", 21);
    });
  });

  // deleting an expense
  describe("DELETE /:id", () => {
    it("should return 404 if no expense with the given id was found", async () => {
      const id = mongoose.Types.ObjectId;

      const res = await request(server).delete(`/api/expenses/${id}`);

      expect(res.status).toBe(404);
    });

    it("should delete the expense if id is valid", async () => {
      const expense = new Expense({
        description: "Test expense",
        amount: 100,
        category: "Entertainment",
      });
      await expense.save();

      const id = expense._id;

      await request(server).delete(`/api/expenses/${id}`);

      const expenseInDb = await Expense.findById(id);

      expect(expenseInDb).toBeNull();
    });

    it("should return the removed expense", async () => {
      const expense = new Expense({
        description: "Test expense",
        amount: 100,
        category: "Entertainment",
      });
      await expense.save();

      const id = expense._id;

      const res = await request(server).delete(`/api/expenses/${id}`);

      await request(server).delete(`/api/expenses/${id}`);

      expect(res.body.deletedExpense).toHaveProperty(
        "_id",
        expense._id.toString()
      );
      expect(res.body.deletedExpense).toHaveProperty(
        "description",
        expense.description
      );
    });
  });
});
