import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// IMPORTANT: serve the Vite build output at dist/public
// At runtime, __dirname === <repo>/dist/server
const publicDir = path.resolve(__dirname, "../public");
app.use(express.static(publicDir));

// SPA fallback (send index.html for client routes)
app.get("*", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
