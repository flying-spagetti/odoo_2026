import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { ExpensesContent } from "@/modules/expenses/ExpensesContent";

export default function ExpensesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Fuel & Expenses"
        description="Track fuel consumption and operational expenditure"
      />
      <ExpensesContent />
    </PageContainer>
  );
}
