"use client";

import { Grid } from "@chakra-ui/react";
import { AccentKpiCard } from "@/components/shared/AccentKpiCard";
import type { MaintenanceListItem } from "../maintenance.types";

interface MaintenanceSummaryCardsProps {
  records: MaintenanceListItem[];
}

export function MaintenanceSummaryCards({
  records,
}: MaintenanceSummaryCardsProps) {
  const openCount = records.filter((record) => record.status === "OPEN").length;
  const inProgressCount = records.filter(
    (record) => record.status === "IN_PROGRESS",
  ).length;
  const completedCount = records.filter(
    (record) => record.status === "CLOSED",
  ).length;
  const vehiclesInShop = new Set(
    records
      .filter((record) => record.vehicle.status === "IN_SHOP")
      .map((record) => record.vehicleId),
  ).size;

  return (
    <Grid
      templateColumns={{
        base: "1fr",
        sm: "repeat(2, 1fr)",
        xl: "repeat(4, 1fr)",
      }}
      gap="4"
    >
      <AccentKpiCard label="Open" value={String(openCount)} accentColor="blue" />
      <AccentKpiCard
        label="In Progress"
        value={String(inProgressCount)}
        accentColor="orange"
      />
      <AccentKpiCard
        label="Completed"
        value={String(completedCount)}
        accentColor="green"
      />
      <AccentKpiCard
        label="Vehicles In Shop"
        value={String(vehiclesInShop)}
        accentColor="orange"
      />
    </Grid>
  );
}
