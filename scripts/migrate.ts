import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Database migration script
 * Runs Drizzle ORM migrations and sets up session storage table
 */

async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("❌ DATABASE_URL is not set in environment variables");
    process.exit(1);
  }

  console.log("🔄 Starting database migration...\n");

  // Create a dedicated connection for migrations with a single connection
  const migrationConnection = postgres(connectionString, {
    max: 1,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    onnotice: () => {}, // Suppress PostgreSQL notices during migration
  });

  try {
    // Run Drizzle migrations
    const db = drizzle(migrationConnection);
    const migrationsFolder = resolve(__dirname, "../migrations");

    console.log("📦 Running Drizzle migrations...");
    await migrate(db, { migrationsFolder });
    console.log("✅ Drizzle migrations completed successfully\n");

    // Create session table for express-session with connect-pg-simple
    // This table is managed separately from Drizzle schema
    console.log("📦 Setting up session storage...");

    await migrationConnection.unsafe(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" VARCHAR NOT NULL COLLATE "default",
        "sess" JSON NOT NULL,
        "expire" TIMESTAMP(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      )
    `);

    await migrationConnection.unsafe(`
      CREATE INDEX IF NOT EXISTS "IDX_session_expire"
      ON "session" ("expire")
    `);

    console.log("✅ Session storage configured successfully\n");
    console.log("🎉 All migrations completed successfully!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:\n");

    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
      if (error.stack) {
        console.error(`\nStack trace:\n${error.stack}`);
      }
    } else {
      console.error(error);
    }

    process.exit(1);
  } finally {
    // Ensure connection is properly closed
    await migrationConnection.end({ timeout: 5 });
  }
}

// Handle unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

main();
