import {
  MaintenanceStatus,
  TripStatus,
  VehicleStatus,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { formatIndianCurrency } from "@/lib/utils/format";
import { getOperationalCostSummary } from "@/modules/expenses/expense.service";
import type {
  AnalyticsOverview,
  CostliestVehicle,
  MonthlyRevenuePoint,
} from "@/types/analytics";

function formatMonthLabel(date: Date): string {
  return date.toLocaleString("en-IN", { month: "short" });
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const [
    costSummary,
    onTripCount,
    activeFleetCount,
    fuelLogs,
    completedTrips,
    vehicles,
    fuelByVehicle,
    expensesByVehicle,
    maintenanceByVehicle,
  ] = await Promise.all([
    getOperationalCostSummary(),
    prisma.vehicle.count({ where: { status: VehicleStatus.ON_TRIP } }),
    prisma.vehicle.count({
      where: { status: { not: VehicleStatus.RETIRED } },
    }),
    prisma.fuelLog.findMany({
      select: { liters: true, costPaise: true, vehicleId: true },
    }),
    prisma.trip.findMany({
      where: {
        status: TripStatus.COMPLETED,
        completedAt: { gte: sixMonthsAgo },
      },
      select: {
        revenuePaise: true,
        plannedDistanceKm: true,
        completedAt: true,
      },
    }),
    prisma.vehicle.findMany({
      where: { status: { not: VehicleStatus.RETIRED } },
      select: {
        id: true,
        name: true,
        acquisitionCostPaise: true,
      },
    }),
    prisma.fuelLog.groupBy({
      by: ["vehicleId"],
      _sum: { costPaise: true },
    }),
    prisma.expense.groupBy({
      by: ["vehicleId"],
      _sum: { amountPaise: true },
    }),
    prisma.maintenanceRecord.groupBy({
      by: ["vehicleId"],
      where: {
        status: MaintenanceStatus.CLOSED,
        actualCostPaise: { not: null },
      },
      _sum: { actualCostPaise: true },
    }),
  ]);

  const totalLiters = fuelLogs.reduce((sum, log) => sum + log.liters, 0);
  const totalDistanceKm = completedTrips.reduce(
    (sum, trip) => sum + trip.plannedDistanceKm,
    0,
  );
  const fuelEfficiency =
    totalLiters > 0 ? totalDistanceKm / totalLiters : 0;

  const fleetUtilization =
    activeFleetCount === 0
      ? 0
      : Math.round((onTripCount / activeFleetCount) * 100);

  const operationalCostRupees = Math.round(
    costSummary.totalTrackedOperatingSpendPaise / 100,
  );

  const totalRevenuePaise = completedTrips.reduce(
    (sum, trip) => sum + (trip.revenuePaise ?? 0),
    0,
  );
  const operatingCostForRoi =
    costSummary.totalFuelCostPaise + costSummary.totalMaintenanceCostPaise;
  const totalAcquisitionPaise = vehicles.reduce(
    (sum, vehicle) => sum + vehicle.acquisitionCostPaise,
    0,
  );
  const vehicleRoi =
    totalAcquisitionPaise > 0
      ? ((totalRevenuePaise - operatingCostForRoi) / totalAcquisitionPaise) *
        100
      : 0;

  const monthBuckets = new Map<string, MonthlyRevenuePoint>();
  for (let offset = 0; offset < 6; offset += 1) {
    const date = new Date(sixMonthsAgo);
    date.setMonth(sixMonthsAgo.getMonth() + offset);
    monthBuckets.set(monthKey(date), {
      month: formatMonthLabel(date),
      revenue: 0,
    });
  }

  for (const trip of completedTrips) {
    if (!trip.completedAt) {
      continue;
    }
    const key = monthKey(trip.completedAt);
    const bucket = monthBuckets.get(key);
    if (bucket) {
      bucket.revenue += Math.round((trip.revenuePaise ?? 0) / 100);
    }
  }

  const monthlyRevenue = Array.from(monthBuckets.values());

  const costByVehicleId = new Map<string, number>();
  for (const row of fuelByVehicle) {
    costByVehicleId.set(
      row.vehicleId,
      (costByVehicleId.get(row.vehicleId) ?? 0) + (row._sum.costPaise ?? 0),
    );
  }
  for (const row of expensesByVehicle) {
    costByVehicleId.set(
      row.vehicleId,
      (costByVehicleId.get(row.vehicleId) ?? 0) + (row._sum.amountPaise ?? 0),
    );
  }
  for (const row of maintenanceByVehicle) {
    costByVehicleId.set(
      row.vehicleId,
      (costByVehicleId.get(row.vehicleId) ?? 0) +
        (row._sum.actualCostPaise ?? 0),
    );
  }

  const vehicleNameById = new Map(
    vehicles.map((vehicle) => [vehicle.id, vehicle.name]),
  );

  const sortedCosts = Array.from(costByVehicleId.entries())
    .map(([vehicleId, costPaise]) => ({
      vehicleName: vehicleNameById.get(vehicleId) ?? "Unknown",
      cost: Math.round(costPaise / 100),
    }))
    .filter((item) => item.cost > 0)
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5);

  const accentCycle = ["red", "orange", "blue"] as const;
  const costliestVehicles: CostliestVehicle[] = sortedCosts.map(
    (item, index) => ({
      vehicleName: item.vehicleName,
      cost: item.cost,
      accentColor: accentCycle[index % accentCycle.length],
    }),
  );

  return {
    kpis: [
      {
        label: "Fuel Efficiency",
        value:
          fuelEfficiency > 0 ? `${fuelEfficiency.toFixed(1)} km/l` : "—",
        accentColor: "blue",
      },
      {
        label: "Fleet Utilization",
        value: `${fleetUtilization}%`,
        accentColor: "green",
      },
      {
        label: "Operational Cost",
        value: formatIndianCurrency(operationalCostRupees),
        accentColor: "orange",
      },
      {
        label: "Vehicle ROI",
        value: `${vehicleRoi.toFixed(1)}%`,
        accentColor: vehicleRoi >= 0 ? "green" : "orange",
      },
    ],
    roiFormula:
      "ROI = (Trip Revenue − (Maintenance + Fuel)) / Acquisition Cost",
    monthlyRevenue,
    costliestVehicles,
  };
}
