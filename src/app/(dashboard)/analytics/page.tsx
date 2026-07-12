"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { PlaceholderPage } from "@/modules/shared/PlaceholderPage";
import { LuChartPie } from "react-icons/lu";

export default function AnalyticsPage() {
  return (
    <PageContainer>
      <PlaceholderPage
        icon={LuChartPie}
        title="Analytics coming soon"
        description="Fleet analytics and reporting will be available in a future release."
      />
    </PageContainer>
  );
}
