import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { VehicleDirectory } from "@/modules/vehicles/VehicleDirectory";

export default function VehiclesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Vehicles"
        description="Manage fleet vehicles, capacity, and operational status"
      />
      <VehicleDirectory />
    </PageContainer>
  );
}
