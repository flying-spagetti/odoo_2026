import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  canMutateExpensesAction,
  getOperationalCostSummaryAction,
  listExpensesAction,
  listFuelLogsAction,
  listVehicleOptionsForExpensesAction,
} from "@/modules/expenses/expense.actions";
import {
  EMPTY_SUMMARY,
  ExpenseWorkspace,
} from "@/modules/expenses/ExpenseWorkspace";

export default async function ExpensesPage() {
  const [fuelResult, expenseResult, summaryResult, vehiclesResult, canMutate] =
    await Promise.all([
      listFuelLogsAction(),
      listExpensesAction(),
      getOperationalCostSummaryAction(),
      listVehicleOptionsForExpensesAction(),
      canMutateExpensesAction(),
    ]);

  const initialFuelLogs = fuelResult.success ? fuelResult.data : [];
  const initialExpenses = expenseResult.success ? expenseResult.data : [];
  const initialSummary = summaryResult.success
    ? summaryResult.data
    : EMPTY_SUMMARY;
  const initialVehicles = vehiclesResult.success ? vehiclesResult.data : [];
  const initialError =
    (!fuelResult.success && fuelResult.error.message) ||
    (!expenseResult.success && expenseResult.error.message) ||
    (!summaryResult.success && summaryResult.error.message) ||
    null;

  return (
    <PageContainer>
      <PageHeader
        title="Fuel & Expenses"
        description="Track fuel purchases, operating expenses, and total fleet spend"
      />
      <ExpenseWorkspace
        initialFuelLogs={initialFuelLogs}
        initialExpenses={initialExpenses}
        initialSummary={initialSummary}
        initialVehicles={initialVehicles}
        canMutate={canMutate}
        initialError={initialError}
      />
    </PageContainer>
  );
}
