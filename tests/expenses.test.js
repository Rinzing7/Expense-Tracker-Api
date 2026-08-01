const request = require("supertest");
const createApp = require("../src/app");
const store = require("../src/data/store");

const app = createApp();

beforeEach(() => {
  store.reset();
});

describe("POST /api/expenses", () => {
  it("creates an expense with valid data", async () => {
    const res = await request(app).post("/api/expenses").send({
      title: "Groceries",
      amount: 45.5,
      category: "Food",
      date: "2026-07-15",
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      title: "Groceries",
      amount: 45.5,
      category: "Food",
    });
    expect(res.body.id).toBeDefined();
  });

  it("defaults the date to today if not provided", async () => {
    const res = await request(app).post("/api/expenses").send({
      title: "Coffee",
      amount: 4.5,
      category: "Food",
    });

    expect(res.status).toBe(201);
    expect(res.body.date).toBeDefined();
  });

  it("rejects a missing title", async () => {
    const res = await request(app).post("/api/expenses").send({
      amount: 10,
      category: "Food",
    });

    expect(res.status).toBe(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it("rejects a negative amount", async () => {
    const res = await request(app).post("/api/expenses").send({
      title: "Refund",
      amount: -5,
      category: "Food",
    });

    expect(res.status).toBe(400);
  });

  it("rejects a non-numeric amount", async () => {
    const res = await request(app).post("/api/expenses").send({
      title: "Bad amount",
      amount: "twenty",
      category: "Food",
    });

    expect(res.status).toBe(400);
  });

  it("rejects an invalid date string", async () => {
    const res = await request(app).post("/api/expenses").send({
      title: "Bad date",
      amount: 10,
      category: "Food",
      date: "not-a-date",
    });

    expect(res.status).toBe(400);
  });
});

describe("GET /api/expenses", () => {
  it("returns an empty list when nothing has been added", async () => {
    const res = await request(app).get("/api/expenses");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns all expenses", async () => {
    await request(app).post("/api/expenses").send({
      title: "Groceries",
      amount: 20,
      category: "Food",
    });
    await request(app).post("/api/expenses").send({
      title: "Bus ticket",
      amount: 3,
      category: "Transport",
    });

    const res = await request(app).get("/api/expenses");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("filters expenses by category (case-insensitive)", async () => {
    await request(app).post("/api/expenses").send({
      title: "Groceries",
      amount: 20,
      category: "Food",
    });
    await request(app).post("/api/expenses").send({
      title: "Bus ticket",
      amount: 3,
      category: "Transport",
    });

    const res = await request(app).get("/api/expenses").query({ category: "food" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe("Groceries");
  });
});

describe("GET /api/expenses/total", () => {
  it("returns 0 total and empty breakdown when there are no expenses", async () => {
    const res = await request(app).get("/api/expenses/total");
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(0);
    expect(res.body.byCategory).toEqual({});
  });

  it("returns the overall total and per-category breakdown", async () => {
    await request(app).post("/api/expenses").send({
      title: "Groceries",
      amount: 20,
      category: "Food",
    });
    await request(app).post("/api/expenses").send({
      title: "Snacks",
      amount: 5,
      category: "Food",
    });
    await request(app).post("/api/expenses").send({
      title: "Bus ticket",
      amount: 3,
      category: "Transport",
    });

    const res = await request(app).get("/api/expenses/total");
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(28);
    expect(res.body.byCategory).toEqual({ Food: 25, Transport: 3 });
  });

  it("returns the total for a specific category", async () => {
    await request(app).post("/api/expenses").send({
      title: "Groceries",
      amount: 20,
      category: "Food",
    });
    await request(app).post("/api/expenses").send({
      title: "Bus ticket",
      amount: 3,
      category: "Transport",
    });

    const res = await request(app).get("/api/expenses/total").query({ category: "Food" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ category: "Food", total: 20 });
  });
});

describe("DELETE /api/expenses/:id", () => {
  it("deletes an existing expense", async () => {
    const createRes = await request(app).post("/api/expenses").send({
      title: "Groceries",
      amount: 20,
      category: "Food",
    });
    const id = createRes.body.id;

    const deleteRes = await request(app).delete(`/api/expenses/${id}`);
    expect(deleteRes.status).toBe(200);

    const listRes = await request(app).get("/api/expenses");
    expect(listRes.body).toHaveLength(0);
  });

  it("returns 404 for a non-existent id", async () => {
    const res = await request(app).delete("/api/expenses/does-not-exist");
    expect(res.status).toBe(404);
  });
});

describe("GET /health", () => {
  it("returns ok status", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
