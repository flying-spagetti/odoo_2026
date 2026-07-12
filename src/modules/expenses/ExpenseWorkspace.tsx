"use client";

import { Button, HStack, Separator, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { LuPlus } from "react-icons/lu";
import { ErrorState } from "@/components/shared/ErrorState";
import { toaster } from "@/components/ui/toaster";
import {
  createExpenseAction,
  createFuelLogAction,
  getOperationalCostSummaryAction,
  listExpensesAction,
  listFuelLogsAction,
  listVehicleOptionsForExpensesAction,
} from "./expense.actions";
import { AddExpenseDialog } from "./components/AddExpenseDialog";
import { ExpenseSummaryBar } from "./components/ExpenseSummaryBar";
import { ExpensesSection } from "./components/ExpensesSection";
import { FuelLogsSection } from "./components/FuelLogsSection";
import { LogFuelDialog } from "./components/LogFuelDialog";
import type {
  CreateExpenseInput,
  CreateFuelLogInput,
  ExpenseFailure,
  ExpenseListItem,
  ExpenseVehicleOption,
  FuelLogListItem,
  OperationalCostSummary,
} from "./expense.types";

const EMPTY_SUMMARY: OperationalCostSummary = {
  totalFuelCostPaise: 0,
  totalMaintenanceCostPaise: 0,
  totalOtherExpenseCostPaise: 0,
  totalTrackedOperatingSpendPaise: 0,
};

interface ExpenseWorkspaceProps {
  initialFuelLogs: FuelLogListItem[];
  initialExpenses: ExpenseListItem[];
  initialSummary: OperationalCostSummary;
  initialVehicles: ExpenseVehicleOption[];
  canMutate: boolean;
  initialError: string | null;
}

export function ExpenseWorkspace({
  initialFuelLogs,
  initialExpenses,
  initialSummary,
  initialVehicles,
  canMutate,
  initialError,
}: ExpenseWorkspaceProps) {
  const [fuelLogs, setFuelLogs] = useState(initialFuelLogs);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [summary, setSummary] = useState(initialSummary);
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [loadError, setLoadError] = useState(initialError);
  const [isRetrying, setIsRetrying] = useState(false);
  const [fuelOpen, setFuelOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [fuelFormKey, setFuelFormKey] = useState(0);
  const [expenseFormKey, setExpenseFormKey] = useState(0);
  const [isCreatingFuel, setIsCreatingFuel] = useState(false);
  const [isCreatingExpense, setIsCreatingExpense] = useState(false);
  const [fuelFailure, setFuelFailure] = useState<ExpenseFailure | null>(null);
  const [expenseFailure, setExpenseFailure] = useState<ExpenseFailure | null>(
    null,
  );

  const refreshWorkspace = async () => {
    const [fuelResult, expenseResult, summaryResult, vehiclesResult] =
      await Promise.all([
        listFuelLogsAction(),
        listExpensesAction(),
        getOperationalCostSummaryAction(),
        listVehicleOptionsForExpensesAction(),
      ]);

    if (!fuelResult.success || !expenseResult.success || !summaryResult.success) {
      const message =
        (!fuelResult.success && fuelResult.error.message) ||
        (!expenseResult.success && expenseResult.error.message) ||
        (!summaryResult.success && summaryResult.error.message) ||
        "Unable to refresh expense data.";
      setLoadError(message);
      return false;
    }

    setLoadError(null);
    setFuelLogs(fuelResult.data);
    setExpenses(expenseResult.data);
    setSummary(summaryResult.data);

    if (vehiclesResult.success) {
      setVehicles(vehiclesResult.data);
    }

    return true;
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    await refreshWorkspace();
    setIsRetrying(false);
  };

  const openFuelDialog = () => {
    setFuelFailure(null);
    setFuelFormKey((current) => current + 1);
    setFuelOpen(true);
  };

  const openExpenseDialog = () => {
    setExpenseFailure(null);
    setExpenseFormKey((current) => current + 1);
    setExpenseOpen(true);
  };

  const handleCreateFuel = async (input: CreateFuelLogInput) => {
    if (isCreatingFuel || isCreatingExpense) {
      return false;
    }

    setIsCreatingFuel(true);
    setFuelFailure(null);

    const result = await createFuelLogAction(input);

    if (!result.success) {
      setFuelFailure(result.error);
      toaster.error({
        title: "Unable to log fuel",
        description: result.error.message,
      });
      setIsCreatingFuel(false);
      return false;
    }

    toaster.success({
      title: "Fuel logged",
      description: `${result.data.vehicle.registrationNumber} · ${result.data.liters} L recorded.`,
    });

    await refreshWorkspace();
    setIsCreatingFuel(false);
    return true;
  };

  const handleCreateExpense = async (input: CreateExpenseInput) => {
    if (isCreatingFuel || isCreatingExpense) {
      return false;
    }

    setIsCreatingExpense(true);
    setExpenseFailure(null);

    const result = await createExpenseAction(input);

    if (!result.success) {
      setExpenseFailure(result.error);
      toaster.error({
        title: "Unable to add expense",
        description: result.error.message,
      });
      setIsCreatingExpense(false);
      return false;
    }

    toaster.success({
      title: "Expense added",
      description: `${result.data.type} recorded for ${result.data.vehicle.registrationNumber}.`,
    });

    await refreshWorkspace();
    setIsCreatingExpense(false);
    return true;
  };

  if (loadError && fuelLogs.length === 0 && expenses.length === 0) {
    return (
      <ErrorState
        title="Unable to load fuel and expenses"
        message={loadError}
        onRetry={() => {
          void handleRetry();
        }}
      />
    );
  }

  return (
    <>
      <VStack align="stretch" gap="6">
        <FuelLogsSection
          fuelLogs={fuelLogs}
          isLoading={isRetrying}
          actions={
            <HStack gap="2" flexWrap="wrap">
              <Button
                size="sm"
                colorPalette="orange"
                disabled={!canMutate}
                onClick={openFuelDialog}
              >
                <LuPlus />
                Log Fuel
              </Button>
              <Button
                size="sm"
                colorPalette="orange"
                variant="outline"
                disabled={!canMutate}
                onClick={openExpenseDialog}
              >
                <LuPlus />
                Add Expense
              </Button>
            </HStack>
          }
        />

        {!canMutate && (
          <Text fontSize="sm" color="gray.500">
            Viewing only. Fleet managers and financial analysts can log fuel and
            expenses.
          </Text>
        )}

        <ExpensesSection expenses={expenses} isLoading={isRetrying} />

        <Separator borderColor="gray.700" />

        <ExpenseSummaryBar summary={summary} />
      </VStack>

      {canMutate && (
        <>
          <LogFuelDialog
            key={fuelFormKey}
            open={fuelOpen}
            vehicles={vehicles}
            isSubmitting={isCreatingFuel}
            failure={fuelFailure}
            onOpenChange={setFuelOpen}
            onSubmit={handleCreateFuel}
          />
          <AddExpenseDialog
            key={expenseFormKey}
            open={expenseOpen}
            vehicles={vehicles}
            isSubmitting={isCreatingExpense}
            failure={expenseFailure}
            onOpenChange={setExpenseOpen}
            onSubmit={handleCreateExpense}
          />
        </>
      )}
    </>
  );
}

export { EMPTY_SUMMARY };
