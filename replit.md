# Meditation App - Zen Timer

## Overview

Zen is a minimalist meditation app designed around distraction-free practice. The application provides guided breathing exercises, meditation timers, and progress tracking with a zen-inspired design philosophy. The app features anonymous session tracking, customizable audio settings, and a clean interface that fades to black during active meditation sessions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite for build tooling
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React's built-in state with TanStack Query for server state
- **Styling**: Tailwind CSS with shadcn/ui components for consistent design
- **UI Components**: Radix UI primitives wrapped in custom components following zen minimalism principles

### Design System
- **Theme Support**: Light/dark mode with CSS custom properties
- **Color Palette**: Neutral grays with earth tone accents (25 25% 65% for timer elements)
- **Typography**: System fonts only for performance and native feel
- **Layout**: Strict spacing system using Tailwind units (2, 4, 8, 12, 16)
- **Responsive**: Mobile-first design with collapsible sidebar navigation

### Backend Architecture
- **Server**: Express.js with TypeScript in ESM format
- **API Design**: RESTful endpoints for sessions, settings, and user data
- **Session Management**: Anonymous user tracking with optional future authentication
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development
- **Error Handling**: Centralized error middleware with structured logging

### Timer System
- **Core Engine**: Web Workers for reliable background timing that continues when tab is inactive
- **Audio Management**: Web Audio API for synthesized bell sounds (tibetan, temple, nature frequencies)
- **Breathing Patterns**: Box breathing (4-4-4-4), 4-7-8 technique, and equal breathing
- **Interface Behavior**: Auto-fade to black during sessions with configurable fade duration

### Data Management
- **Database**: PostgreSQL with Drizzle ORM for type-safe queries
- **Schema**: Sessions, user settings, and optional user accounts
- **Migration**: Drizzle Kit for schema management and database migrations
- **Data Validation**: Zod schemas for runtime type checking and API validation

### Session Tracking
- **Anonymous Sessions**: UUID-based anonymous user identification stored locally
- **Session Data**: Preset selection, duration, completion percentage, and timestamps
- **Progress Analytics**: Total time, session count, streaks, and favorite techniques
- **Settings Persistence**: Audio preferences, interval bells, and interface behavior

## External Dependencies

### Database & ORM
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database queries and migrations
- **Connect PG Simple**: PostgreSQL session store for Express

### Frontend Libraries
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with validation
- **Date-fns**: Date manipulation and formatting
- **Embla Carousel**: Touch-friendly carousels for preset selection

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible component primitives
- **Lucide React**: Consistent icon library
- **Class Variance Authority**: Component variant management

### Development Tools
- **Vite**: Fast build tool with HMR and TypeScript support
- **ESBuild**: Fast bundling for production builds
- **PostCSS & Autoprefixer**: CSS processing and vendor prefixes
- **Replit Plugins**: Development banner and error overlay for Replit environment