require('dotenv').config({ path: '../.env' });
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedAdminUser() {
  try {
    // Check if the users table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.error('Users table does not exist. Please run migrations first.');
      process.exit(1);
    }

    // Check if admin user already exists
    const adminCheck = await pool.query(`
      SELECT * FROM users WHERE email = $1 AND role = 'admin'
    `, [process.env.ADMIN_EMAIL || 'admin@homatravel.com']);

    if (adminCheck.rows.length > 0) {
      console.log('Admin user already exists. Skipping seed.');
      process.exit(0);
    }

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@homatravel.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    // Insert admin user
    await pool.query(`
      INSERT INTO users (email, password, role, created_at, updated_at)
      VALUES ($1, $2, 'admin', NOW(), NOW())
    `, [adminEmail, hashedPassword]);

    console.log(`Admin user created successfully: ${adminEmail}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedAdminUser();