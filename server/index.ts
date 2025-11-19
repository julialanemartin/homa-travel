import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import passport from "./auth/passport.js";
import authRoutes from "./auth/routes.js";
import dotenv from "dotenv";
import cors from "cors";
import pg from "pg";

const { Pool } = pg;

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (allow frontend dev server)
app.use(cors({
  origin: "http://localhost:5174", // <-- just plain string, no brackets
  credentials: true,               // allow cookies/session
}));

// Session configuration
const PgSession = connectPgSimple(session);
const pgPool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(session({
store: new PgSession({
pool: pgPool,
tableName: "session",
createTableIfMissing: true,
}),
secret: process.env.SESSION_SECRET || "dev-secret-key",
resave: false,
saveUninitialized: false,
cookie: {
maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
httpOnly: true,
secure: process.env.NODE_ENV === "production",
sameSite: "lax",
},
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Auth API routes (signup/login/reset)
app.use("/api/auth", authRoutes);

// Serve frontend (Vite dev or build output)
const publicDir = path.resolve(__dirname, "../client-test"); // new frontend folder
app.use(express.static(publicDir));

// SPA fallback (send index.html for unknown routes)
app.get(/.*/, (_req, res) => {
res.sendFile(path.join(publicDir, "index.html"));
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
app.listen(PORT, () => {
console.log(`Server listening on port ${PORT}`);
});
