const express = require("express");
const expensesRouter = require("./routes/expenses");

function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api/expenses", expensesRouter);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  // Generic error handler (e.g. malformed JSON bodies)
  app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
      return res.status(400).json({ error: "Malformed JSON in request body" });
    }
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  });

  return app;
}

module.exports = createApp;
