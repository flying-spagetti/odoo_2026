import type {
  ExpenseSummary,
  FuelLog,
  OperationalExpense,
} from "@/types/expense";

export const MOCK_EXPENSE_SUMMARY: ExpenseSummary = {
  totalFuelCost: 284500,
  totalMaintenanceCost: 156200,
  totalOperationalCost: 478900,
};

export const MOCK_FUEL_LOGS: FuelLog[] = [
  {
    id: "f1",
    date: "2026-07-11",
    vehicleRegistration: "MH-12-AB-4521",
    litres: 180,
    cost: 16200,
    odometerKm: 145100,
  },
  {
    id: "f2",
    date: "2026-07-10",
    vehicleRegistration: "DL-01-CD-8834",
    litres: 150,
    cost: 13500,
    odometerKm: 98100,
  },
  {
    id: "f3",
    date: "2026-07-09",
    vehicleRegistration: "UP-32-MN-1188",
    litres: 220,
    cost: 19800,
    odometerKm: 88800,
  },
  {
    id: "f4",
    date: "2026-07-08",
    vehicleRegistration: "GJ-06-IJ-3344",
    litres: 165,
    cost: 14850,
    odometerKm: 178700,
  },
];

export const MOCK_OPERATIONAL_EXPENSES: OperationalExpense[] = [
  {
    id: "e1",
    date: "2026-07-11",
    category: "Maintenance",
    description: "Brake pad replacement — KA-05-EF-2210",
    amount: 12500,
  },
  {
    id: "e2",
    date: "2026-07-10",
    category: "Toll",
    description: "Mumbai-Pune expressway toll",
    amount: 3200,
  },
  {
    id: "e3",
    date: "2026-07-09",
    category: "Maintenance",
    description: "Engine oil change — DL-01-CD-8834",
    amount: 4800,
  },
  {
    id: "e4",
    date: "2026-07-08",
    category: "Insurance",
    description: "Quarterly fleet insurance premium",
    amount: 45000,
  },
  {
    id: "e5",
    date: "2026-07-07",
    category: "Permit",
    description: "Interstate transport permit renewal",
    amount: 8500,
  },
];
