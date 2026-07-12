import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  canMutateVehiclesAction,
  listVehiclesAction,
} from "@/modules/vehicles/vehicle.actions";
import { VehiclesWorkspace } from "@/modules/vehicles/VehiclesWorkspace";

export default async function VehiclesPage() {
  const [vehiclesResult, canMutate] = await Promise.all([
    listVehiclesAction(),
    canMutateVehiclesAction(),
  ]);

  const initialVehicles = vehiclesResult.success ? vehiclesResult.data : [];
  const initialError = vehiclesResult.success
    ? null
    : vehiclesResult.error.message;

  return (
    <PageContainer>
      <PageHeader
        title="Fleet"
        description="Vehicle registry, status tracking, and fleet capacity"
      />
      <VehiclesWorkspace
        initialVehicles={initialVehicles}
        canMutate={canMutate}
        initialError={initialError}
      />
    </PageContainer>
  );
}
