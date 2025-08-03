# Travel Destination Platform (Homa Travel Co.)

## Overview

Homa Travel Co. is a comprehensive travel platform built with React, TypeScript, and Express.js that helps users discover personalized travel destinations. The platform features destination matching, travel planning tools, budget calculators, flight tracking, and social features like mood boards and user lists.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state
- **UI Components**: Custom component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Session Management**: Express sessions with memory store
- **Authentication**: Passport.js with local strategy for user auth, custom JWT for admin auth

### Database Architecture
- **Primary Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations
- **Connection Pooling**: Neon serverless connection pooling

## Key Components

### Core Features
1. **Destination Discovery System**
   - Interactive quiz-based destination matching
   - Filtering by continent, tags, and preferences
   - Featured destinations carousel with animations

2. **Travel Planning Tools**
   - Budget calculator with cost breakdowns by destination
   - Trip planner with weather, packing, and cultural information
   - Flight price tracking and alerts system

3. **User-Generated Content**
   - Personal destination lists and collections
   - Mood boards for travel inspiration
   - Social sharing features

4. **E-commerce Integration**
   - Digital travel products and guides
   - Shopping cart functionality
   - Stripe payment processing

5. **Content Management**
   - Blog system with categorization and search
   - Admin dashboard for content management
   - Local destinations database

### External Integrations
1. **Payment Processing**: Stripe for secure payments
2. **AI Content Generation**: OpenAI API for travel story generation
3. **Flight Data**: Amadeus/Skyscanner APIs for flight pricing
4. **Maps & Location**: National Park Service API for outdoor attractions

## Data Flow

### User Journey
1. User discovers destinations through quiz or browsing
2. Creates personalized lists and mood boards
3. Uses planning tools for budget and itinerary
4. Purchases digital guides and resources
5. Shares experiences through social features

### Admin Management
1. Admin manages destinations, blog posts, and products
2. Monitors user engagement and quiz responses
3. Updates cost data and travel information
4. Configures site settings and testimonials

## External Dependencies

### APIs and Services
- **Neon Database**: PostgreSQL hosting and connection management
- **Stripe**: Payment processing and subscription management
- **OpenAI**: AI-powered content generation for travel stories
- **Amadeus/Skyscanner**: Flight price data and tracking
- **National Park Service**: Authentic attraction and park data

### Development Tools
- **Drizzle Kit**: Database schema management and migrations
- **ESBuild**: Production bundling for server code
- **TypeScript**: Type safety across frontend and backend
- **Zod**: Runtime type validation and schema parsing

## Deployment Strategy

### Development Environment
- Vite dev server for hot-reload frontend development
- TSX for TypeScript execution in development
- Express server with middleware for API handling

### Production Build
- Vite builds optimized frontend assets
- ESBuild creates bundled server distribution
- Static assets served from dist/public directory

### Live Deployment (January 13, 2025)
- **Domain**: homatravel.co (purchased and configured)
- **Hosting**: Replit Deployments
- **Replit URL**: travel-connector-julialanemartin.replit.app
- **DNS Configuration**: Namecheap Advanced DNS with A Record and CNAME
- **Status**: Live and operational

### Environment Configuration
- Database connection via DATABASE_URL environment variable
- API keys managed through environment variables
- Session secrets and Stripe keys configured per environment

### Key Architecture Decisions

1. **Monorepo Structure**: Frontend and backend share TypeScript types through shared schema
2. **Database Strategy**: PostgreSQL chosen for relational data integrity and complex queries
3. **State Management**: React Query eliminates need for global state management
4. **Authentication**: Dual auth system - Passport for users, JWT for admin panel
5. **UI Framework**: Radix UI + Tailwind for accessibility and customization
6. **Type Safety**: End-to-end TypeScript with Zod validation at API boundaries