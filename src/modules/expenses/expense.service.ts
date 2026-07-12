import { MaintenanceStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { rupeesToPaise } from "@/lib/utils/format";
import { ExpenseDomainError } from "./expense.errors";
import {
  toExpenseListItem,
  toExpenseTripOption,
  toExpenseVehicleOption,
  toFuelLogListItem,
} from "./expense.mapper";
import type {
  CreateExpenseInput,
  CreateFuelLogInput,
  ExpenseListItem,
  ExpenseTripOption,
  ExpenseVehicleOption,
  FuelLogListItem,
  OperationalCostSummary,
} from "./expense.types";

const fuelLogInclude = {
  vehicle: true,
  trip: true,
} as const;

const expenseInclude = {
  vehicle: true,
  trip: true,
} as const;

async function assertVehicleExists(vehicleId: string) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    select: { id: true },
  });

  if (!vehicle) {
    throw new ExpenseDomainError(
      "VEHICLE_NOT_FOUND",
      `Vehicle ${vehicleId} was not found.`,
    );
  }
}

async function assertOptionalTripBelongsToVehicle(
  vehicleId: string,
  tripId?: string,
) {
  if (!tripId) {
    return;
  }

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { id: true, vehicleId: true },
  });

  if (!trip) {
    throw new ExpenseDomainError(
      "TRIP_NOT_FOUND",
      `Trip ${tripId} was not found.`,
    );
  }

  if (trip.vehicleId !== vehicleId) {
    throw new ExpenseDomainError(
      "TRIP_VEHICLE_MISMATCH",
      "Selected trip does not belong to the selected vehicle.",
    );
  }
}

export async function listFuelLogs(): Promise<FuelLogListItem[]> {
  const logs = await prisma.fuelLog.findMany({
    include: fuelLogInclude,
    orderBy: [{ loggedAt: "desc" }, { createdAt: "desc" }],
  });

  return logs.map(toFuelLogListItem);
}

export async function listExpenses(): Promise<ExpenseListItem[]> {
  const expenses = await prisma.expense.findMany({
    include: expenseInclude,
    orderBy: [{ incurredAt: "desc" }, { createdAt: "desc" }],
  });

  return expenses.map(toExpenseListItem);
}

export async function getOperationalCostSummary(): Promise<OperationalCostSummary> {
  const [fuelAggregate, maintenanceAggregate, expenseAggregate] =
    await Promise.all([
      prisma.fuelLog.aggregate({
        _sum: { costPaise: true },
      }),
      prisma.maintenanceRecord.aggregate({
        where: {
          status: MaintenanceStatus.CLOSED,
          actualCostPaise: { not: null },
        },
        _sum: { actualCostPaise: true },
      }),
      prisma.expense.aggregate({
        _sum: { amountPaise: true },
      }),
    ]);

  const totalFuelCostPaise = fuelAggregate._sum.costPaise ?? 0;
  const totalMaintenanceCostPaise =
    maintenanceAggregate._sum.actualCostPaise ?? 0;
  const totalOtherExpenseCostPaise = expenseAggregate._sum.amountPaise ?? 0;

  return {
    totalFuelCostPaise,
    totalMaintenanceCostPaise,
    totalOtherExpenseCostPaise,
    totalTrackedOperatingSpendPaise:
      totalFuelCostPaise +
      totalMaintenanceCostPaise +
      totalOtherExpenseCostPaise,
  };
}

export async function listVehicleOptionsForExpenses(): Promise<
  ExpenseVehicleOption[]
> {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: [{ registrationNumber: "asc" }, { name: "asc" }],
  });

  return vehicles.map(toExpenseVehicleOption);
}

export async function listTripOptionsForVehicle(
  vehicleId: string,
): Promise<ExpenseTripOption[]> {
  await assertVehicleExists(vehicleId);

  const trips = await prisma.trip.findMany({
    where: { vehicleId },
    orderBy: [{ createdAt: "desc" }],
  });

  return trips.map(toExpenseTripOption);
}

export async function createFuelLog(
  input: CreateFuelLogInput,
): Promise<FuelLogListItem> {
  await assertVehicleExists(input.vehicleId);
  await assertOptionalTripBelongsToVehicle(input.vehicleId, input.tripId);

  const costPaise = rupeesToPaise(input.costRupees);

  if (costPaise <= 0) {
    throw new ExpenseDomainError(
      "VALIDATION_ERROR",
      "Fuel cost must be greater than zero.",
    );
  }

  const log = await prisma.fuelLog.create({
    data: {
      vehicleId: input.vehicleId,
      tripId: input.tripId,
      liters: input.liters,
      costPaise,
      odometerKm: input.odometerKm,
      loggedAt: new Date(input.loggedAt),
    },
    include: fuelLogInclude,
  });

  return toFuelLogListItem(log);
}

export async function createExpense(
  input: CreateExpenseInput,
): Promise<ExpenseListItem> {
  await assertVehicleExists(input.vehicleId);
  await assertOptionalTripBelongsToVehicle(input.vehicleId, input.tripId);

  const amountPaise = rupeesToPaise(input.amountRupees);

  if (amountPaise <= 0) {
    throw new ExpenseDomainError(
      "VALIDATION_ERROR",
      "Expense amount must be greater than zero.",
    );
  }

  const expense = await prisma.expense.create({
    data: {
      vehicleId: input.vehicleId,
      tripId: input.tripId,
      type: input.type,
      description: input.description,
      amountPaise,
      incurredAt: new Date(input.incurredAt),
    },
    include: expenseInclude,
  });

  return toExpenseListItem(expense);
}
