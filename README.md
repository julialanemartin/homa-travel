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

- Node.js (v14+)
- PostgreSQL database (Supabase)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL=postgresql://user:password@host:port/database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key

# Session
SESSION_SECRET=your-super-secret-session-key-change-in-production

# Email (for password reset)
EMAIL_FROM=noreply@example.com
EMAIL_SERVER=smtp://user:pass@smtp.example.com:587

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
node scripts/migrate.js
```

3. (Optional) Seed an admin user:

```bash
node scripts/seed.js
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