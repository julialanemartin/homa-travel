// server/index.ts
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Simple health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Serve the built client (Vite outputs to client/dist at the project root)
const clientDist = path.resolve(__dirname, "../client/dist");
app.use(express.static(clientDist));
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
