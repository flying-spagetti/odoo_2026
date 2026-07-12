import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { DriverDirectory } from "@/modules/drivers/DriverDirectory";

export default function DriversPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Drivers"
        description="Manage driver licences, safety scores, and availability"
      />
      <DriverDirectory />
    </PageContainer>
  );
}
