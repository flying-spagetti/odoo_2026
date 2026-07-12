import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { TripDispatcher } from "@/modules/trips/TripDispatcher";

export default function TripsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Trip Dispatcher"
        description="Create draft trips, validate dispatch readiness, and monitor the live board"
      />
      <TripDispatcher />
    </PageContainer>
  );
}
