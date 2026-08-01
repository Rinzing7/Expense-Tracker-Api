const { v4: uuidv4 } = require("uuid");
const store = require("../data/store");

/**
 * Validates the body for creating an expense.
 * Returns an array of error strings; empty array means valid.
 */
function validateExpenseInput(body) {
  const errors = [];
  const { title, amount, category, date } = body;

  if (!title || typeof title !== "string" || !title.trim()) {
    errors.push("title is required and must be a non-empty string");
  }

  if (amount === undefined || amount === null || typeof amount !== "number" || Number.isNaN(amount)) {
    errors.push("amount is required and must be a number");
  } else if (amount <= 0) {
    errors.push("amount must be greater than 0");
  }

  if (!category || typeof category !== "string" || !category.trim()) {
    errors.push("category is required and must be a non-empty string");
  }

  if (date !== undefined) {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      errors.push("date must be a valid date string (e.g. 2026-07-30)");
    }
  }

  return errors;
}

function createExpense(req, res) {
  const errors = validateExpenseInput(req.body || {});
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const { title, amount, category, date } = req.body;

  const expense = {
    id: uuidv4(),
    title: title.trim(),
    amount,
    category: category.trim(),
    date: date ? new Date(date).toISOString() : new Date().toISOString(),
  };

  store.add(expense);
  return res.status(201).json(expense);
}

function getExpenses(req, res) {
  const { category } = req.query;
  const expenses = category ? store.getByCategory(category) : store.getAll();
  return res.status(200).json(expenses);
}

function getExpenseTotal(req, res) {
  const { category } = req.query;

  if (category) {
    return res.status(200).json({
      category,
      total: store.getTotal(category),
    });
  }

  return res.status(200).json({
    total: store.getTotal(),
    byCategory: store.getTotalsByCategory(),
  });
}

function deleteExpense(req, res) {
  const { id } = req.params;
  const removed = store.deleteById(id);

  if (!removed) {
    return res.status(404).json({ error: `Expense with id '${id}' not found` });
  }

  return res.status(200).json({ message: "Expense deleted", expense: removed });
}

module.exports = {
  validateExpenseInput,
  createExpense,
  getExpenses,
  getExpenseTotal,
  deleteExpense,
};
