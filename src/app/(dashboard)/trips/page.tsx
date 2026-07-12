"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { PlaceholderPage } from "@/modules/shared/PlaceholderPage";
import { LuRoute } from "react-icons/lu";

export default function TripsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Trips"
        description="Dispatch, track, and complete transport trips"
      />
      <PlaceholderPage
        icon={LuRoute}
        title="Trip management coming soon"
        description="Trip dispatch, validation, and lifecycle management is being built by the trip domain team. Navigation is ready for integration."
      />
    </PageContainer>
  );
}
