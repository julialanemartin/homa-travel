# Homa Travel - Project Instructions

## Project Overview
Homa Travel is a full-stack web application built with Express.js backend and a modern frontend, featuring user authentication, password reset functionality, and session management.

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM v0.39.1
- **Migrations**: Drizzle Kit v0.30.4
- **Authentication**: Passport.js (local strategy)
- **Session Storage**: PostgreSQL via connect-pg-simple
- **Email**: Resend API
- **Password Hashing**: bcrypt

### Frontend
- **Build Tool**: Vite
- **UI Framework**: React (assumed based on Vite setup)

## Database Configuration

### Schema Location
- Schema definitions: `/server/db/schema.ts`
- Database connection: `/server/db/index.ts`
- Drizzle config: `/drizzle.config.ts`

### Migration Strategy
Use Drizzle Kit for all database migrations. Never write manual SQL migration scripts.

**Generate migrations:**
```bash
npm run db:generate
```

**Apply migrations:**
```bash
npm run db:migrate
```

**Push schema changes (dev only):**
```bash
npm run db:push
```

### Database Tables
1. **users** - User accounts with email/password authentication
2. **password_reset_tokens** - Password reset token management
3. **session** - Express session storage (managed by connect-pg-simple)

## Environment Variables
Required variables in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption secret
- `RESEND_API_KEY` - Email service API key
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)

## Code Standards

### TypeScript
- Use strict TypeScript settings
- Prefer type inference where clear
- Use Drizzle's infer types for database schemas

### Database Operations
- Always use Drizzle ORM methods (db.select, db.insert, db.update, db.delete)
- Never write raw SQL queries unless absolutely necessary
- Use transactions for multi-step operations
- Always handle database errors properly

### File Organization
- Database schema: `/server/db/schema.ts`
- Auth routes: `/server/auth/routes.ts`
- Server entry: `/server/index.ts`
- Scripts: `/scripts/` directory

### Commit Guidelines
- Write concise, descriptive commit messages
- Focus on what changed and why
- Stage changes before committing
- No automated footers or attribution lines

## Development Workflow

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Type Check
```bash
npm run check
```

## Important Notes
- All database schema changes must be made in `/server/db/schema.ts`
- After schema changes, run `npm run db:generate` to create migrations
- Session table is auto-managed by connect-pg-simple
- Password reset tokens expire after a set time period
- Always hash passwords with bcrypt before storing
