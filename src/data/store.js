/**
 * In-memory data store for expenses.
 *
 * Kept deliberately simple (a plain array) since the assignment does not
 * require a database. Exported as a small set of functions so the
 * controller layer never touches the array directly — that keeps the
 * storage mechanism swappable (e.g. for a JSON-file or DB-backed store)
 * without changing any route/controller code.
 */

let expenses = [];

function reset() {
  expenses = [];
}

function getAll() {
  return expenses;
}

function getByCategory(category) {
  return expenses.filter(
    (e) => e.category.toLowerCase() === category.toLowerCase()
  );
}

function add(expense) {
  expenses.push(expense);
  return expense;
}

function findById(id) {
  return expenses.find((e) => e.id === id);
}

function deleteById(id) {
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) return null;
  const [removed] = expenses.splice(index, 1);
  return removed;
}

function getTotal(category) {
  const source = category ? getByCategory(category) : expenses;
  return source.reduce((sum, e) => sum + e.amount, 0);
}

function getTotalsByCategory() {
  const totals = {};
  for (const e of expenses) {
    totals[e.category] = (totals[e.category] || 0) + e.amount;
  }
  return totals;
}

module.exports = {
  reset,
  getAll,
  getByCategory,
  add,
  findById,
  deleteById,
  getTotal,
  getTotalsByCategory,
};
