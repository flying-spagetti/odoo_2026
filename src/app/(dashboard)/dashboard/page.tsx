import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { getDashboardOverviewAction } from "@/modules/analytics/dashboard.actions";
import { DashboardContent } from "@/modules/analytics/DashboardContent";

export default async function DashboardPage() {
  const result = await getDashboardOverviewAction();

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Operational overview of fleet activity and resource status"
      />
      <DashboardContent
        data={result.success ? result.data : null}
        errorMessage={result.success ? null : result.error.message}
      />
    </PageContainer>
  );
}
