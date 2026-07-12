# TransitOps

> A smart transport operations platform that keeps vehicles, drivers, trips, maintenance, fuel, and expenses working from the same source of truth.

Built by a two-person team during the **Odoo Hackathon 2026**.

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma" />
  <img alt="Chakra UI" src="https://img.shields.io/badge/Chakra_UI-v3-319795?logo=chakraui" />
</p>

---

## Why TransitOps

Transport teams often manage vehicles, drivers, trips, maintenance, fuel, and expenses across spreadsheets, phone calls, and separate records.

That makes everyday mistakes surprisingly easy:

- A vehicle or driver can be assigned twice
- An overloaded vehicle can be dispatched
- An expired or suspended driver can be missed
- A vehicle under maintenance can still appear available
- Trip, vehicle, and driver statuses can drift out of sync
- Teams can end up working from different versions of the same information

TransitOps brings those operations into one connected workflow and stops invalid actions before they become real-world problems.

---

## What we focused on

We deliberately chose **one complete operational loop** over a larger set of disconnected screens.

The core journey is:

```text
Available vehicle and driver
        ↓
Trip planned
        ↓
Readiness checked
        ↓
Trip dispatched
        ↓
Vehicle and driver marked On Trip
        ↓
Trip completed or cancelled
        ↓
Vehicle and driver returned to Available
```

Maintenance is part of that same loop:

```text
Vehicle available
        ↓
Maintenance created
        ↓
Vehicle marked In Shop
        ↓
Vehicle removed from dispatch
        ↓
Maintenance completed
        ↓
Vehicle returned to Available
```

The result is a product where one action updates every connected record instead of asking users to remember several manual steps.

---

## Product decisions that shaped the build

### 1. Prevent mistakes at the point of action

TransitOps does not wait until after dispatch to surface a problem.

Before a trip leaves, it checks whether:

- The trip is still in Draft
- The vehicle is available
- The driver is available
- The driver licence is valid
- The driver is not suspended
- Cargo is within vehicle capacity
- The vehicle is not already assigned elsewhere
- The driver is not already assigned elsewhere

### 2. Explain what failed

A blocked action should help the user recover.

Instead of returning only `Invalid request`, TransitOps shows every readiness check, which conditions passed, which condition failed, and what needs to be corrected.

Example:

```text
Vehicle available: Passed
Driver available: Passed
Licence valid: Passed
Cargo capacity: Failed

Cargo exceeds vehicle capacity by 200 kg
```

### 3. Keep connected records consistent

Dispatching a trip updates three records together:

```text
Trip       → DISPATCHED
Vehicle    → ON_TRIP
Driver     → ON_TRIP
```

Completing or cancelling the trip restores the affected resources automatically.

### 4. Make maintenance affect dispatch immediately

A maintenance record is not treated as a separate note.

When maintenance opens, the vehicle moves to `IN_SHOP` and becomes unavailable for trip assignment. When the work closes, it returns to `AVAILABLE`, unless the vehicle has been retired.

### 5. Keep permissions on the server

Users do not choose their own role from the login screen.

Their access comes from the authenticated account, and protected actions are checked again on the server.

### 6. Design for conflicting requests

If two dispatchers attempt to claim the same vehicle or driver at nearly the same time, only one operation succeeds. The other receives a clear failure instead of creating a double assignment.

---

## Demo flow

The strongest product journey is:

```text
Sign in as Dispatcher
→ Open an overweight trip
→ See exactly why dispatch is blocked
→ Open a valid trip
→ Dispatch it
→ Vehicle and driver move to On Trip
→ Complete the trip
→ Vehicle and driver return to Available
→ Sign in as Fleet Manager
→ Create maintenance
→ Vehicle moves to In Shop
→ Close maintenance
→ Vehicle returns to Available
```

This demonstrates that trips, fleet availability, driver availability, and maintenance all operate as one system.

---

## Roles

### Fleet Manager

Responsible for:

- Vehicle registry
- Fleet availability
- Maintenance records
- Returning vehicles to service

### Dispatcher

Responsible for:

- Trip readiness
- Vehicle and driver assignment
- Dispatch
- Trip completion
- Trip cancellation

### Safety Officer

Responsible for:

- Driver profiles
- Licence validity
- Driver status
- Safety information

### Financial Analyst

Responsible for:

- Fuel logs
- Operational expenses
- Cost summaries
- Revenue and analytics

---

## Features

### Authentication and access

- Email and password sign-in
- Four operational roles
- Server-owned permissions
- Role-aware post-login navigation
- Remembered email without storing the password
- Demo accounts for quick evaluation

### Vehicle management

- Add and view vehicles
- Unique registration numbers
- Vehicle type, model, region, capacity, cost, and odometer
- Availability and lifecycle status
- Search and filtering

### Driver management

- Add and view drivers
- Unique licence numbers
- Licence category and expiry
- Contact details
- Safety score
- Availability, off-duty, and suspended states

### Trip operations

- Draft, dispatched, completed, and cancelled trips
- Vehicle and driver assignment
- Readiness checks before dispatch
- Cargo-capacity validation
- Expired-licence prevention
- Duplicate assignment prevention
- Trip completion with final odometer
- Automatic resource status updates

### Maintenance

- Create maintenance records
- Open, start, complete, and cancel maintenance
- Automatic `IN_SHOP` vehicle status
- Dispatch blocking while maintenance is active
- Automatic return to service after completion
- Priority and cost tracking

### Fuel and expenses

- Record fuel purchases
- Record tolls, parking, repairs, and other costs
- Link costs to vehicles and trips
- Track fuel quantity, odometer, and spend
- View fleet operating-cost summaries

### Dashboard and analytics

- Fleet availability
- Active and completed trips
- Driver status
- Vehicles in maintenance
- Revenue and cost summaries
- Vehicle utilisation
- Monthly operating trends

### Interface

- Responsive desktop and mobile layouts
- Clear status badges
- Purpose-built operational workspaces
- Loading, success, and failure states
- Confirmation dialogs for important actions
- Consistent light and dark visual surfaces

---

## Core business rules

TransitOps enforces the following rules inside the application:

1. Vehicle registration numbers must be unique.
2. Driver licence numbers must be unique.
3. Retired vehicles cannot be dispatched.
4. Vehicles under maintenance cannot be dispatched.
5. Suspended drivers cannot be dispatched.
6. Drivers with expired licences cannot be dispatched.
7. Vehicles already on a trip cannot be assigned again.
8. Drivers already on a trip cannot be assigned again.
9. Cargo cannot exceed the selected vehicle's capacity.
10. Dispatching marks the selected vehicle and driver as `ON_TRIP`.
11. Completing a trip restores the vehicle and driver to `AVAILABLE`.
12. Cancelling a dispatched trip restores the vehicle and driver to `AVAILABLE`.
13. Opening maintenance marks the vehicle as `IN_SHOP`.
14. Closing maintenance restores the vehicle to `AVAILABLE`, unless retired.
15. Final odometer readings cannot be lower than the current odometer.

---

## Reliability decisions

Some implementation choices were made specifically to protect the workflow:

- Business rules are checked on the server, not only in React
- Related state changes run together so records do not partially update
- Resource claims are conditional, preventing double assignment during competing requests
- Failure responses include useful context for the interface
- Currency values are stored as integer paise
- Odometer values are prevented from moving backwards
- Vehicle registration and driver licence values are unique at the database level
- Maintenance and trip assignment use the same vehicle availability state
- Roles are stored with the authenticated user and are not client-selectable

---

## Technology

### Application

- Next.js 16
- React 19
- TypeScript
- Chakra UI v3
- Recharts
- React Icons
- date-fns

### Data and server

- PostgreSQL
- Prisma ORM
- Prisma PostgreSQL adapter
- Next.js Server Actions
- Zod validation

### Authentication

- Better Auth

---

## Architecture

```text
User Interface
      ↓
Server Action or Route Handler
      ↓
Feature Service
      ↓
Database Transaction
      ↓
PostgreSQL
```

The interface handles presentation and user feedback.

Feature services decide whether an operation is valid.

Database transactions keep connected records in sync.

Business rules live inside their feature modules rather than being scattered across page components.

---

## Project structure

```text
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── vehicles/
│   │   ├── drivers/
│   │   ├── trips/
│   │   ├── maintenance/
│   │   ├── expenses/
│   │   ├── analytics/
│   │   └── settings/
│   └── api/
│       └── auth/
│
├── components/
│   ├── layout/
│   ├── shared/
│   └── ui/
│
├── modules/
│   ├── analytics/
│   ├── drivers/
│   ├── expenses/
│   ├── maintenance/
│   ├── trips/
│   └── vehicles/
│
├── lib/
│   ├── auth/
│   ├── db/
│   └── utils/
│
└── generated/
    └── prisma/

prisma/
├── schema.prisma
├── seed.ts
├── seed-auth.ts
├── verify-auth.ts
└── verify-maintenance.ts
```

Each feature module keeps its own validation, server actions, workflow logic, database access, types, and interface components close together.

---

## Demo accounts

All demo accounts use the password:

```text
TransitOps123!
```

| Role | Email |
|---|---|
| Fleet Manager | `fleet@transitops.demo` |
| Dispatcher | `dispatcher@transitops.demo` |
| Safety Officer | `safety@transitops.demo` |
| Financial Analyst | `finance@transitops.demo` |

---

## Getting started

### Requirements

- Node.js 20 or later
- npm
- PostgreSQL

### 1. Clone the repository

```bash
git clone https://github.com/flying-spagetti/odoo_2026.git
cd odoo_2026
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/transitops"

BETTER_AUTH_SECRET="replace-with-a-secure-secret"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
```

### 4. Set up the database

```bash
npm run db:migrate
npm run db:seed
npm run db:seed-auth
```

### 5. Start the application

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Available scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Generate the Prisma client and build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate the Prisma client |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed operational demo data |
| `npm run db:seed-auth` | Create the demo user accounts |
| `npm run db:verify-auth` | Verify authentication and role permissions |
| `npm run db:verify-maintenance` | Verify maintenance and trip interaction |
| `npm run db:studio` | Open Prisma Studio |

---

## Workflow states

### Trip

```text
DRAFT
  ├── DISPATCHED
  │     ├── COMPLETED
  │     └── CANCELLED
  └── CANCELLED
```

### Vehicle

```text
AVAILABLE
  ├── ON_TRIP
  ├── IN_SHOP
  └── RETIRED
```

### Driver

```text
AVAILABLE
  ├── ON_TRIP
  ├── OFF_DUTY
  └── SUSPENDED
```

### Maintenance

```text
OPEN
  ↓
IN_PROGRESS
  ↓
CLOSED
```

---

## Verification

Build the production application:

```bash
npm run build
```

Verify authentication and permissions:

```bash
npm run db:verify-auth
```

Verify the connection between maintenance and trip availability:

```bash
npm run db:verify-maintenance
```

The maintenance verification covers:

- Opening maintenance
- Starting maintenance
- Completing maintenance
- Vehicle status transitions
- Duplicate active-maintenance prevention
- Dispatch restrictions
- Interaction between trips and maintenance

---

## Team

### Gnaneswar Lopinti

Worked on:

- Product workflow decisions
- Authentication and role permissions
- Trip readiness checks
- Dispatch lifecycle
- Vehicle and driver state transitions
- Maintenance workflow
- Database integration
- Server-side validation
- Failure handling
- Demo journey

### Sandeep

Worked on:

- Application interface
- Dashboard screens
- Fleet and driver screens
- Expense and analytics screens
- Settings
- Responsive layouts
- Visual consistency across the product

---

## Hackathon approach

Our priority order was:

1. Complete one real workflow
2. Enforce the important rules
3. Make failures understandable
4. Keep connected records consistent
5. Build a reliable demonstration
6. Improve the interface
7. Add reporting and supporting modules

We wanted TransitOps to feel like a product that could continue growing after the hackathon, not a set of temporary demo screens.

---

## Future improvements

- Trip creation and editing
- Route planning and map support
- Live vehicle location
- Licence-expiry notifications
- Scheduled maintenance reminders
- Fuel-efficiency trends
- Expense approval workflow
- CSV import and export
- Full audit history
- Multi-depot support
- Driver shift planning
- Document uploads
- Operational alerts

---

## Closing note

TransitOps turns a fragmented transport process into one clear and trackable workflow.

It helps teams catch mistakes before they become real problems, understand what needs attention, and keep vehicles, drivers, trips, maintenance, fuel, and expenses working from the same information.
