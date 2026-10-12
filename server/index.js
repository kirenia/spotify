import "dotenv/config";
import express from "express";
import { sequelize } from "./db/index.js";
import "./models/Token.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

await sequelize.sync();
console.log("Database synced");

app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
