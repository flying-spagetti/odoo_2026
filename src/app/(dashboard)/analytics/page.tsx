import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { AnalyticsContent } from "@/modules/analytics/AnalyticsContent";

export default function AnalyticsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Analytics"
        description="Fleet performance, operational costs, and utilization trends"
      />
      <AnalyticsContent />
    </PageContainer>
  );
}
