# TransitOps

TransitOps is a transport operations platform built for the Odoo Hackathon 2026.

## Goal

Build one complete operational workflow covering:

- Vehicle management
- Driver management
- Trip dispatch
- Dispatch validation
- Automatic resource status transitions
- Maintenance
- Fuel and expense tracking
- Operational dashboard

## Core Product Principle

The system must prevent invalid operations instead of merely warning users.

## Mandatory Business Rules

- Vehicle registration numbers must be unique.
- In Shop and Retired vehicles cannot be dispatched.
- Suspended drivers cannot be dispatched.
- Drivers with expired licences cannot be dispatched.
- On Trip vehicles and drivers cannot be assigned again.
- Cargo weight cannot exceed vehicle capacity.
- Dispatching updates vehicle and driver to On Trip.
- Completing or cancelling restores both to Available.
- Opening maintenance changes the vehicle to In Shop.
- Closing maintenance restores the vehicle to Available unless retired.

## Technical Stack

- Next.js App Router
- TypeScript
- Chakra UI
- Prisma
- SQLite
- Zod
- Better Auth
- Recharts
- date-fns
- Lucide React

## Architecture

UI
→ Server Action or Route Handler
→ Domain Service
→ Prisma Transaction
→ SQLite

Business rules must not live only inside React components.

## Visual Direction

A professional transport operations dashboard.

- Clean light background
- White operational surfaces
- Consistent spacing
- Clear status badges
- Responsive sidebar
- Tables for operational records
- Drawers or dialogs for forms
- No unnecessary gradients
- No decorative landing-page design

## Priority

1. Complete workflow
2. Correct business rules
3. Reliable demo
4. Consistent interface
5. Analytics
6. Bonus features

## Folder Architecture 

src/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── vehicles/
│   │   ├── drivers/
│   │   ├── trips/
│   │   ├── maintenance/
│   │   └── expenses/
│   └── api/
├── components/
│   ├── layout/
│   ├── shared/
│   └── ui/
├── modules/
│   ├── vehicles/
│   ├── drivers/
│   ├── trips/
│   ├── maintenance/
│   └── analytics/
├── lib/
│   ├── auth/
│   ├── db.ts
│   └── utils/
└── types/

Each module gets:

trip.schema.ts
trip.service.ts
trip.actions.ts
trip.types.ts

No giant utils.ts. No 700-line page component.