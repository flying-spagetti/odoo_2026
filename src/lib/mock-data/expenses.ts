import type { ExpenseSummary, FuelLog, TripExpense } from "@/types/expense";

export const MOCK_FUEL_LOGS: FuelLog[] = [
  {
    id: "f1",
    vehicleName: "VAN-05",
    date: "2026-07-05",
    litres: 42,
    fuelCost: 3150,
  },
  {
    id: "f2",
    vehicleName: "TRUCK-11",
    date: "2026-07-06",
    litres: 110,
    fuelCost: 8400,
  },
  {
    id: "f3",
    vehicleName: "MINI-08",
    date: "2026-07-06",
    litres: 28,
    fuelCost: 2050,
  },
];

export const MOCK_TRIP_EXPENSES: TripExpense[] = [
  {
    id: "e1",
    tripCode: "TR001",
    vehicleName: "VAN-05",
    toll: 120,
    other: 0,
    maintenanceLinked: 0,
    status: "AVAILABLE",
  },
  {
    id: "e2",
    tripCode: "TR002",
    vehicleName: "TRK-12",
    toll: 340,
    other: 150,
    maintenanceLinked: 18000,
    status: "COMPLETED",
  },
];

export const MOCK_EXPENSE_SUMMARY: ExpenseSummary = {
  totalFuelCost: MOCK_FUEL_LOGS.reduce((sum, log) => sum + log.fuelCost, 0),
  totalMaintenanceCost: MOCK_TRIP_EXPENSES.reduce(
    (sum, expense) => sum + expense.maintenanceLinked,
    0,
  ),
  totalOperationalCost: 34070,
};
