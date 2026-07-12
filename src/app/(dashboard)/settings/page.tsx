"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { PlaceholderPage } from "@/modules/shared/PlaceholderPage";
import { LuSettings } from "react-icons/lu";

export default function SettingsPage() {
  return (
    <PageContainer>
      <PlaceholderPage
        icon={LuSettings}
        title="Settings coming soon"
        description="Application settings and preferences will be available in a future release."
      />
    </PageContainer>
  );
}
