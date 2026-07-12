import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  canMutateDriversAction,
  listDriversAction,
} from "@/modules/drivers/driver.actions";
import { DriversWorkspace } from "@/modules/drivers/DriversWorkspace";

export default async function DriversPage() {
  const [driversResult, canMutate] = await Promise.all([
    listDriversAction(),
    canMutateDriversAction(),
  ]);

  const initialDrivers = driversResult.success ? driversResult.data : [];
  const initialError = driversResult.success
    ? null
    : driversResult.error.message;

  return (
    <PageContainer>
      <PageHeader
        title="Drivers"
        description="Manage licence profiles, safety clearance, and assignment readiness"
      />
      <DriversWorkspace
        initialDrivers={initialDrivers}
        canMutate={canMutate}
        initialError={initialError}
      />
    </PageContainer>
  );
}
