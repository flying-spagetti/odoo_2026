"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { PlaceholderPage } from "@/modules/shared/PlaceholderPage";
import { LuWrench } from "react-icons/lu";

export default function MaintenancePage() {
  return (
    <PageContainer>
      <PageHeader
        title="Maintenance"
        description="Track vehicle maintenance and service records"
      />
      <PlaceholderPage
        icon={LuWrench}
        title="Maintenance module coming soon"
        description="Maintenance workflows and vehicle state transitions are being built by the maintenance domain team. Navigation is ready for integration."
      />
    </PageContainer>
  );
}
