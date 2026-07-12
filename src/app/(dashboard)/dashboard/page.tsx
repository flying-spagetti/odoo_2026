import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { DashboardContent } from "@/modules/analytics/DashboardContent";

export default function DashboardPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Operational overview of fleet activity and resource status"
      />
      <DashboardContent />
    </PageContainer>
  );
}
