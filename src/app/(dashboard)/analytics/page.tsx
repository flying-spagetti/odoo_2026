import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { getAnalyticsOverviewAction } from "@/modules/analytics/analytics.actions";
import { AnalyticsContent } from "@/modules/analytics/AnalyticsContent";

export default async function AnalyticsPage() {
  const result = await getAnalyticsOverviewAction();

  return (
    <PageContainer>
      <PageHeader
        title="Analytics"
        description="Fleet performance, operational costs, and utilization trends"
      />
      <AnalyticsContent
        data={result.success ? result.data : null}
        errorMessage={result.success ? null : result.error.message}
      />
    </PageContainer>
  );
}
