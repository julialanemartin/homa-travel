# Homa Travel

Authentication system with Express, Passport, and React.

## Features

- User authentication (signup, login, logout)
- Role-based access control (admin/user)
- Secure password reset flow
- Session management with PostgreSQL store
- React + TypeScript + Tailwind UI components

## Setup Instructions

### Prerequisites

- Node.js (v20+)
- PostgreSQL database (Supabase or any PostgreSQL instance)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Session
SESSION_SECRET=your-super-secret-session-key-change-in-production

# Email (Resend API for password reset)
RESEND_API_KEY=your-resend-api-key

# Admin User (Optional - for seeding)
ADMIN_EMAIL=admin@homatravel.com
ADMIN_PASSWORD=Admin123!

# App
NODE_ENV=development
PORT=5000
```

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up the database:

```bash
# Run migrations to create tables
npm run db:migrate
```

3. (Optional) Seed an admin user:

```bash
npm run db:seed
```

4. Start the development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

6. Start the production server:

```bash
npm start
```

## Database Management

### Available Commands

```bash
# Generate migrations from schema changes
npm run db:generate

# Run pending migrations
npm run db:migrate

# Seed admin user
npm run db:seed

# Push schema changes directly (development only)
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio
```

### Making Schema Changes

1. Update schema in `server/db/schema.ts`
2. Generate migration: `npm run db:generate`
3. Review the generated SQL in `migrations/` directory
4. Apply migration: `npm run db:migrate`

### Database Technology Stack

- **ORM**: Drizzle ORM v0.39.1
- **Migration Tool**: Drizzle Kit v0.30.4
- **Database Driver**: postgres v3.4.7
- **Session Store**: connect-pg-simple

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Log in with email and password
- `POST /api/auth/logout` - Log out the current user
- `GET /api/auth/me` - Get the current authenticated user
- `POST /api/auth/forgot-password` - Request a password reset token
- `POST /api/auth/reset-password` - Reset password with token

### Health Check

- `GET /api/health` - Check API health status

## Security Features

- Bcrypt password hashing
- Secure HTTP-only cookies
- Rate limiting on authentication routes
- One-time use password reset tokens with expiry
- CSRF protection

## Role-Based Access Control

- Regular users can access their own data
- Admin users can access all data and admin-only routes