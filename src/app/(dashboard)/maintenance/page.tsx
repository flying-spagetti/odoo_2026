import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  canMutateMaintenanceAction,
  listEligibleVehiclesForMaintenanceAction,
  listMaintenanceRecordsAction,
} from "@/modules/maintenance/maintenance.actions";
import { MaintenanceWorkspace } from "@/modules/maintenance/MaintenanceWorkspace";

export default async function MaintenancePage() {
  const [recordsResult, vehiclesResult, canMutate] = await Promise.all([
    listMaintenanceRecordsAction(),
    listEligibleVehiclesForMaintenanceAction(),
    canMutateMaintenanceAction(),
  ]);

  const initialRecords = recordsResult.success ? recordsResult.data : [];
  const initialVehicles = vehiclesResult.success ? vehiclesResult.data : [];
  const initialError = recordsResult.success
    ? null
    : recordsResult.error.message;

  return (
    <PageContainer>
      <PageHeader
        title="Maintenance"
        description="Open shop work, track progress, and restore vehicles to the dispatch pool"
      />
      <MaintenanceWorkspace
        initialRecords={initialRecords}
        initialVehicles={initialVehicles}
        canMutate={canMutate}
        initialError={initialError}
      />
    </PageContainer>
  );
}
