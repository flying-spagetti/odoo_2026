# TransitOps

TransitOps is a transport operations platform built for the **Odoo Hackathon 2026**. It covers fleet management, driver operations, trip dispatch, maintenance, fuel and expense tracking, analytics, and role-based access — with business rules enforced in domain services, not only in the UI.

## Features

- **Authentication (RBAC)** — email/password sign-in with four operational roles
- **Dashboard** — fleet KPIs and operational overview
- **Fleet registry** — vehicle search, filters, and status tracking
- **Drivers** — licence-aware driver directory
- **Trips** — dispatch workflow (domain-owned)
- **Maintenance** — service logging and vehicle state transitions (domain-owned)
- **Fuel & Expenses** — fuel logs and trip-level operational costs
- **Analytics** — revenue and cost reporting
- **Settings** — general depot preferences and RBAC matrix

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Chakra UI v3
- Prisma + PostgreSQL
- Better Auth
- Zod
- Recharts
- date-fns

## Prerequisites

- Node.js 20+
- PostgreSQL database
- npm

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/transitops"
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
```

### 3. Set up the database

```bash
npm run db:migrate
npm run db:seed
npm run db:seed-auth
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to `/login`.

## Demo Accounts

All demo accounts share the password **`TransitOps123!`**

| Role | Email |
|------|-------|
| Fleet Manager | `fleet@transitops.demo` |
| Dispatcher | `dispatcher@transitops.demo` |
| Safety Officer | `safety@transitops.demo` |
| Financial Analyst | `finance@transitops.demo` |

## Application Routes

| Route | Description |
|-------|-------------|
| `/login` | Sign-in with role selection |
| `/dashboard` | Operational overview |
| `/vehicles` | Fleet registry |
| `/drivers` | Driver directory |
| `/trips` | Trip management |
| `/maintenance` | Service records |
| `/expenses` | Fuel and expense tracking |
| `/analytics` | Reports and analytics |
| `/settings` | General settings and RBAC |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Generate Prisma client and build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed operational demo data |
| `npm run db:seed-auth` | Provision demo auth accounts |
| `npm run db:verify-auth` | Verify auth and RBAC setup |
| `npm run db:studio` | Open Prisma Studio |

## Architecture

```
UI → Server Action / Route Handler → Domain Service → Prisma Transaction → PostgreSQL
```

Business rules live in domain services under `src/modules/`. React components handle presentation; mock data in `src/lib/mock-data/` is used until server integration is complete.

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/
│   ├── (dashboard)/     # dashboard, vehicles, drivers, trips, etc.
│   └── api/auth/
├── components/
│   ├── layout/          # App shell, sidebar, header
│   ├── shared/          # KPI cards, tables, status badges
│   └── ui/              # Chakra provider, toaster
├── modules/             # Feature modules (vehicles, trips, analytics, …)
├── lib/
│   ├── auth/
│   ├── mock-data/
│   └── utils/
└── types/
```

## Core Business Rules

- Vehicle registration numbers must be unique
- In Shop and Retired vehicles cannot be dispatched
- Suspended drivers and expired licences cannot be dispatched
- On Trip vehicles and drivers cannot be double-assigned
- Cargo weight cannot exceed vehicle capacity
- Dispatching sets vehicle and driver to On Trip; completing or cancelling restores both to Available
- Opening maintenance moves a vehicle to In Shop; closing restores Available unless retired

See [PROJECT.md](./PROJECT.md) for full product and architecture documentation.
