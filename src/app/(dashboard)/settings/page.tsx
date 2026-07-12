import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { SettingsContent } from "@/modules/settings/SettingsContent";

export default function SettingsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Depot configuration, units, and role-based access control"
      />
      <SettingsContent />
    </PageContainer>
  );
}
