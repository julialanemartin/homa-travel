import "dotenv/config";
import bcrypt from "bcrypt";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import * as schema from "../server/db/schema.js";

/**
 * Database seeding script
 * Creates initial admin user if one doesn't exist
 */

const DEFAULT_ADMIN_EMAIL = "admin@homatravel.com";
const DEFAULT_ADMIN_PASSWORD = "Admin123!";
const BCRYPT_SALT_ROUNDS = 10;

async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("❌ DATABASE_URL is not set in environment variables");
    process.exit(1);
  }

  console.log("🌱 Starting database seed...\n");

  const connection = postgres(connectionString, {
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  });

  const db = drizzle(connection, { schema });

  try {
    const adminEmail = process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;

    console.log(`👤 Checking for existing admin user: ${adminEmail}`);

    // Check if admin user already exists
    const existingAdmins = await db
      .select({ id: schema.users.id, email: schema.users.email })
      .from(schema.users)
      .where(eq(schema.users.email, adminEmail))
      .limit(1);

    if (existingAdmins.length > 0) {
      console.log("✅ Admin user already exists. Skipping seed.\n");
      console.log(`📧 Email: ${existingAdmins[0].email}`);
      console.log(`🆔 ID: ${existingAdmins[0].id}`);
      process.exit(0);
    }

    // Hash the password
    console.log("🔐 Hashing admin password...");
    const hashedPassword = await bcrypt.hash(adminPassword, BCRYPT_SALT_ROUNDS);

    // Insert admin user
    console.log("📝 Creating admin user...");
    const [newAdmin] = await db
      .insert(schema.users)
      .values({
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      })
      .returning({ id: schema.users.id, email: schema.users.email });

    console.log("✅ Admin user created successfully!\n");
    console.log("─────────────────────────────────");
    console.log(`🆔 User ID: ${newAdmin.id}`);
    console.log(`📧 Email: ${newAdmin.email}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log("─────────────────────────────────");
    console.log("\n⚠️  IMPORTANT: Change the admin password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:\n");

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
    await connection.end({ timeout: 5 });
  }
}

// Handle unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

main();
