import type {
  Expense,
  FuelLog,
  Trip,
  Vehicle,
} from "@/generated/prisma/client";
import type {
  ExpenseListItem,
  ExpenseTripOption,
  ExpenseTripSummary,
  ExpenseVehicleOption,
  ExpenseVehicleSummary,
  FuelLogListItem,
} from "./expense.types";

const SEED_TRIP_CODES: Record<string, string> = {
  "seed-trip-draft": "TR001",
  "seed-trip-dispatched": "TR002",
  "seed-trip-blocked": "TR004",
  "seed-trip-cancelled": "TR006",
};

type FuelLogWithRelations = FuelLog & {
  vehicle: Vehicle;
  trip: Trip | null;
};

type ExpenseWithRelations = Expense & {
  vehicle: Vehicle;
  trip: Trip | null;
};

export function formatExpenseTripCode(tripId: string): string {
  return SEED_TRIP_CODES[tripId] ?? `TR-${tripId.slice(-6).toUpperCase()}`;
}

function toVehicleSummary(vehicle: Vehicle): ExpenseVehicleSummary {
  return {
    id: vehicle.id,
    name: vehicle.name,
    registrationNumber: vehicle.registrationNumber,
  };
}

function toTripSummary(trip: Trip): ExpenseTripSummary {
  return {
    id: trip.id,
    tripCode: formatExpenseTripCode(trip.id),
    source: trip.source,
    destination: trip.destination,
  };
}

export function toFuelLogListItem(log: FuelLogWithRelations): FuelLogListItem {
  return {
    id: log.id,
    vehicleId: log.vehicleId,
    tripId: log.tripId,
    liters: log.liters,
    costPaise: log.costPaise,
    odometerKm: log.odometerKm,
    loggedAt: log.loggedAt.toISOString(),
    createdAt: log.createdAt.toISOString(),
    vehicle: toVehicleSummary(log.vehicle),
    trip: log.trip ? toTripSummary(log.trip) : null,
  };
}

export function toExpenseListItem(
  expense: ExpenseWithRelations,
): ExpenseListItem {
  return {
    id: expense.id,
    vehicleId: expense.vehicleId,
    tripId: expense.tripId,
    type: expense.type,
    description: expense.description,
    amountPaise: expense.amountPaise,
    incurredAt: expense.incurredAt.toISOString(),
    createdAt: expense.createdAt.toISOString(),
    vehicle: toVehicleSummary(expense.vehicle),
    trip: expense.trip ? toTripSummary(expense.trip) : null,
  };
}

export function toExpenseVehicleOption(vehicle: Vehicle): ExpenseVehicleOption {
  return {
    id: vehicle.id,
    name: vehicle.name,
    registrationNumber: vehicle.registrationNumber,
    odometerKm: vehicle.odometerKm,
  };
}

export function toExpenseTripOption(trip: Trip): ExpenseTripOption {
  return {
    id: trip.id,
    tripCode: formatExpenseTripCode(trip.id),
    source: trip.source,
    destination: trip.destination,
    status: trip.status,
  };
}
