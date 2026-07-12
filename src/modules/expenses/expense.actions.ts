"use server";

import { Role } from "@/generated/prisma/client";
import {
  getActingUser,
  requireAuthenticatedUser,
  requireExpenseMutationRole,
} from "@/lib/auth/acting-user";
import { toExpenseFailure } from "./expense.errors";
import {
  createExpenseInputSchema,
  createFuelLogInputSchema,
  expenseVehicleIdSchema,
} from "./expense.schema";
import {
  createExpense,
  createFuelLog,
  getOperationalCostSummary,
  listExpenses,
  listFuelLogs,
  listTripOptionsForVehicle,
  listVehicleOptionsForExpenses,
} from "./expense.service";
import type {
  CreateExpenseInput,
  CreateFuelLogInput,
  ExpenseActionResult,
  ExpenseListItem,
  ExpenseTripOption,
  ExpenseVehicleOption,
  FuelLogListItem,
  OperationalCostSummary,
} from "./expense.types";

async function runExpenseAction<T>(
  action: () => Promise<T>,
): Promise<ExpenseActionResult<T>> {
  try {
    const data = await action();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: toExpenseFailure(error) };
  }
}

export async function listFuelLogsAction(): Promise<
  ExpenseActionResult<FuelLogListItem[]>
> {
  return runExpenseAction(async () => {
    await requireAuthenticatedUser();
    return listFuelLogs();
  });
}

export async function listExpensesAction(): Promise<
  ExpenseActionResult<ExpenseListItem[]>
> {
  return runExpenseAction(async () => {
    await requireAuthenticatedUser();
    return listExpenses();
  });
}

export async function getOperationalCostSummaryAction(): Promise<
  ExpenseActionResult<OperationalCostSummary>
> {
  return runExpenseAction(async () => {
    await requireAuthenticatedUser();
    return getOperationalCostSummary();
  });
}

export async function listVehicleOptionsForExpensesAction(): Promise<
  ExpenseActionResult<ExpenseVehicleOption[]>
> {
  return runExpenseAction(async () => {
    await requireAuthenticatedUser();
    return listVehicleOptionsForExpenses();
  });
}

export async function listTripOptionsForVehicleAction(
  vehicleId: string,
): Promise<ExpenseActionResult<ExpenseTripOption[]>> {
  return runExpenseAction(async () => {
    await requireAuthenticatedUser();

    const parsedId = expenseVehicleIdSchema.safeParse(vehicleId);

    if (!parsedId.success) {
      throw parsedId.error;
    }

    return listTripOptionsForVehicle(parsedId.data);
  });
}

export async function canMutateExpensesAction(): Promise<boolean> {
  const user = await getActingUser();
  return (
    user !== null &&
    (user.role === Role.FLEET_MANAGER ||
      user.role === Role.FINANCIAL_ANALYST)
  );
}

export async function createFuelLogAction(
  input: CreateFuelLogInput,
): Promise<ExpenseActionResult<FuelLogListItem>> {
  return runExpenseAction(async () => {
    await requireExpenseMutationRole();

    const parsed = createFuelLogInputSchema.safeParse(input);

    if (!parsed.success) {
      throw parsed.error;
    }

    return createFuelLog(parsed.data);
  });
}

export async function createExpenseAction(
  input: CreateExpenseInput,
): Promise<ExpenseActionResult<ExpenseListItem>> {
  return runExpenseAction(async () => {
    await requireExpenseMutationRole();

    const parsed = createExpenseInputSchema.safeParse(input);

    if (!parsed.success) {
      throw parsed.error;
    }

    return createExpense(parsed.data);
  });
}
