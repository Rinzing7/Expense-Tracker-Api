const express = require("express");
const {
  createExpense,
  getExpenses,
  getExpenseTotal,
  deleteExpense,
} = require("../controllers/expensesController");

const router = express.Router();

// IMPORTANT: /total must be registered before /:id-style routes elsewhere
// but since we only have /:id on DELETE, ordering isn't an issue here —
// kept as a comment for future maintainers if a GET /:id route is added.

router.post("/", createExpense);
router.get("/", getExpenses);
router.get("/total", getExpenseTotal);
router.delete("/:id", deleteExpense);

module.exports = router;
