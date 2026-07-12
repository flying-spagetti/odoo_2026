import type { ExpenseType } from "@/generated/prisma/client";

export type ExpenseFailureCode =
  | "VEHICLE_NOT_FOUND"
  | "TRIP_NOT_FOUND"
  | "TRIP_VEHICLE_MISMATCH"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "UNKNOWN_ERROR";

export type ExpenseFailure = {
  code: ExpenseFailureCode;
  message: string;
};

export type ExpenseActionSuccess<T> = {
  success: true;
  data: T;
};

export type ExpenseActionFailure = {
  success: false;
  error: ExpenseFailure;
};

export type ExpenseActionResult<T> =
  | ExpenseActionSuccess<T>
  | ExpenseActionFailure;

export type ExpenseVehicleSummary = {
  id: string;
  name: string;
  registrationNumber: string;
};

export type ExpenseTripSummary = {
  id: string;
  tripCode: string;
  source: string;
  destination: string;
};

export type FuelLogListItem = {
  id: string;
  vehicleId: string;
  tripId: string | null;
  liters: number;
  costPaise: number;
  odometerKm: number;
  loggedAt: string;
  createdAt: string;
  vehicle: ExpenseVehicleSummary;
  trip: ExpenseTripSummary | null;
};

export type ExpenseListItem = {
  id: string;
  vehicleId: string;
  tripId: string | null;
  type: ExpenseType;
  description: string;
  amountPaise: number;
  incurredAt: string;
  createdAt: string;
  vehicle: ExpenseVehicleSummary;
  trip: ExpenseTripSummary | null;
};

export type OperationalCostSummary = {
  totalFuelCostPaise: number;
  totalMaintenanceCostPaise: number;
  totalOtherExpenseCostPaise: number;
  totalTrackedOperatingSpendPaise: number;
};

export type ExpenseVehicleOption = {
  id: string;
  name: string;
  registrationNumber: string;
  odometerKm: number;
};

export type ExpenseTripOption = {
  id: string;
  tripCode: string;
  source: string;
  destination: string;
  status: string;
};

export type CreateFuelLogInput = {
  vehicleId: string;
  tripId?: string;
  liters: number;
  costRupees: number;
  odometerKm: number;
  loggedAt: string;
};

export type CreateExpenseInput = {
  vehicleId: string;
  tripId?: string;
  type: ExpenseType;
  description: string;
  amountRupees: number;
  incurredAt: string;
};
