"use client";

import { Card, FormatNumber, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import { format } from "date-fns";
import {
  LuActivity,
  LuBus,
  LuRoute,
  LuUser,
  LuWrench,
} from "react-icons/lu";
import { KpiCard } from "@/components/shared/KpiCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  MOCK_DASHBOARD_KPIS,
  MOCK_FLEET_ACTIVITY,
} from "@/lib/mock-data/dashboard";

export function DashboardContent() {
  const kpis = MOCK_DASHBOARD_KPIS;

  return (
    <VStack align="stretch" gap="6">
      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap="4"
      >
        <KpiCard
          label="Active Vehicles"
          value={kpis.activeVehicles}
          icon={LuBus}
          description="Currently on trip"
        />
        <KpiCard
          label="Available Vehicles"
          value={kpis.availableVehicles}
          icon={LuBus}
          description="Ready for dispatch"
        />
        <KpiCard
          label="Vehicles in Maintenance"
          value={kpis.vehiclesInMaintenance}
          icon={LuWrench}
          description="In shop or under repair"
        />
        <KpiCard
          label="Fleet Utilization"
          value={kpis.fleetUtilization}
          suffix="%"
          icon={LuActivity}
          description="Active vs total fleet"
        />
      </Grid>

      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap="4"
      >
        <KpiCard
          label="Active Trips"
          value={kpis.activeTrips}
          icon={LuRoute}
          description="Dispatched and in progress"
        />
        <KpiCard
          label="Pending Trips"
          value={kpis.pendingTrips}
          icon={LuRoute}
          description="Awaiting dispatch"
        />
        <KpiCard
          label="Drivers On Duty"
          value={kpis.driversOnDuty}
          icon={LuUser}
          description="Available or on trip"
        />
      </Grid>

      <Card.Root variant="outline">
        <Card.Header>
          <Card.Title fontSize="md">Operational Overview</Card.Title>
          <Card.Description>
            Recent fleet activity across trips, dispatch, and maintenance
          </Card.Description>
        </Card.Header>
        <Card.Body pt="0">
          <VStack align="stretch" gap="0">
            {MOCK_FLEET_ACTIVITY.map((item, index) => (
              <HStack
                key={item.id}
                justify="space-between"
                align={{ base: "flex-start", sm: "center" }}
                direction={{ base: "column", sm: "row" }}
                gap={{ base: "2", sm: "4" }}
                py="3"
                borderBottomWidth={
                  index < MOCK_FLEET_ACTIVITY.length - 1 ? "1px" : undefined
                }
                borderColor="border.muted"
              >
                <VStack align="stretch" gap="0.5" flex="1" minW="0">
                  <Text fontSize="sm" fontWeight="medium" truncate>
                    {item.description}
                  </Text>
                  <Text fontSize="xs" color="fg.muted">
                    {format(new Date(item.timestamp), "dd MMM yyyy, HH:mm")}
                  </Text>
                </VStack>
                <StatusBadge status={item.status} />
              </HStack>
            ))}
          </VStack>
        </Card.Body>
      </Card.Root>

      <Card.Root variant="outline" bg="blue.50" borderColor="blue.100">
        <Card.Body>
          <Text fontSize="sm" color="fg.muted">
            Fleet summary:{" "}
            <Text as="span" fontWeight="semibold" color="fg">
              <FormatNumber value={kpis.activeVehicles + kpis.availableVehicles} />{" "}
              total vehicles
            </Text>
            ,{" "}
            <Text as="span" fontWeight="semibold" color="fg">
              <FormatNumber value={kpis.activeTrips + kpis.pendingTrips} /> trips
            </Text>{" "}
            in pipeline,{" "}
            <Text as="span" fontWeight="semibold" color="fg">
              <FormatNumber value={kpis.fleetUtilization} />%
            </Text>{" "}
            utilization rate.
          </Text>
        </Card.Body>
      </Card.Root>
    </VStack>
  );
}
