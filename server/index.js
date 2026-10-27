import "dotenv/config";
import express from "express";
import { sequelize } from "./db/index.js";
import "./models/Token.js";
import authRouter from "./routes/auth.js";
import cors from "cors";
import apiRouter from "./routes/api.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
// let the react app talk to us
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use("/auth", authRouter);
app.use("/api", apiRouter);

// GET /api/health - quick check that the server is up
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

await sequelize.sync();
console.log("Database synced");

app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
