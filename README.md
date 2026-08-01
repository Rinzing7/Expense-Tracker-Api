# Smart Expense Tracker API

A REST API for tracking personal expenses, built with Node.js and Express.
Data is stored in memory (no database required) — restarting the server
clears all expenses.

## What it does

- **Add an expense** — `POST /api/expenses`
- **View all expenses** — `GET /api/expenses`
- **Filter by category** — `GET /api/expenses?category=Food`
- **Totals (overall and by category)** — `GET /api/expenses/total`
- **Total for one category** — `GET /api/expenses/total?category=Food`
- **Delete an expense** — `DELETE /api/expenses/:id`
- **Health check** — `GET /health`

## Requirements

- Node.js 18 or later
- npm

## Install

```bash
npm install
```

## Run the server

```bash
npm start
```

The server listens on `http://localhost:3000` by default. Set the `PORT`
environment variable to use a different port.

## Run the tests

```bash
npm test
```

This runs the Jest + Supertest suite in `tests/expenses.test.js`, which
exercises every endpoint (including validation and error cases) against
the Express app directly, without needing the server to be running.

## API reference

### `POST /api/expenses`

Request body:

```json
{
  "title": "Groceries",
  "amount": 45.5,
  "category": "Food",
  "date": "2026-07-15"
}
```

`date` is optional and defaults to the current date/time if omitted.
Returns `201` with the created expense (including a generated `id`), or
`400` with an `errors` array if validation fails (missing title/category,
non-numeric or non-positive amount, invalid date).

### `GET /api/expenses`

Returns all expenses as a JSON array. Optional `?category=` query param
filters by category (case-insensitive).

### `GET /api/expenses/total`

Without a query param, returns:

```json
{ "total": 123.45, "byCategory": { "Food": 80, "Transport": 43.45 } }
```

With `?category=Food`, returns:

```json
{ "category": "Food", "total": 80 }
```

### `DELETE /api/expenses/:id`

Deletes the expense with the given id. Returns `200` with the deleted
expense on success, or `404` if no expense with that id exists.

## Project structure

```
expense-tracker-api/
  README.md
  AI_NOTES.md
  package.json
  src/
    app.js                          # Express app setup (exported, not started)
    server.js                       # starts the HTTP server
    routes/expenses.js              # route definitions
    controllers/expensesController.js  # request handlers + validation
    data/store.js                   # in-memory data store
  tests/
    expenses.test.js                # Jest + Supertest suite
```

## Design notes

- Storage is isolated behind `src/data/store.js` so the in-memory array
  could be swapped for a JSON file or a real database later without
  touching the routes or controllers.
- Validation lives in the controller and rejects missing fields,
  non-numeric/non-positive amounts, and invalid date strings.
- `src/app.js` exports a factory function (`createApp`) rather than a
  started server, which is what lets the test suite import and test the
  app directly without binding to a port.

## Possible next steps (not implemented)

Per the assignment, only one optional bonus is expected at most, and
none is included here to keep the core requirements solid. Natural
candidates if more time were available: a search endpoint (by title
substring), a monthly summary endpoint, OpenAPI/Swagger docs, or a
Dockerfile.
