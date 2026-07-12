import {
  DriverStatus,
  TripStatus,
  VehicleStatus,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import type {
  DashboardOverview,
  FleetActivityItem,
} from "./dashboard.types";

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const [
    activeVehicles,
    availableVehicles,
    vehiclesInMaintenance,
    retiredVehicles,
    totalVehicles,
    activeTrips,
    pendingTrips,
    driversOnDuty,
    recentTrips,
    recentMaintenance,
  ] = await Promise.all([
    prisma.vehicle.count({ where: { status: VehicleStatus.ON_TRIP } }),
    prisma.vehicle.count({ where: { status: VehicleStatus.AVAILABLE } }),
    prisma.vehicle.count({ where: { status: VehicleStatus.IN_SHOP } }),
    prisma.vehicle.count({ where: { status: VehicleStatus.RETIRED } }),
    prisma.vehicle.count(),
    prisma.trip.count({ where: { status: TripStatus.DISPATCHED } }),
    prisma.trip.count({ where: { status: TripStatus.DRAFT } }),
    prisma.driver.count({
      where: {
        status: {
          in: [DriverStatus.AVAILABLE, DriverStatus.ON_TRIP],
        },
      },
    }),
    prisma.trip.findMany({
      take: 8,
      orderBy: [{ updatedAt: "desc" }],
      include: {
        vehicle: { select: { registrationNumber: true, name: true } },
        driver: { select: { name: true } },
      },
    }),
    prisma.maintenanceRecord.findMany({
      take: 5,
      orderBy: [{ updatedAt: "desc" }],
      include: {
        vehicle: { select: { registrationNumber: true, name: true } },
      },
    }),
  ]);

  const activeFleet = Math.max(totalVehicles - retiredVehicles, 0);
  const fleetUtilization =
    activeFleet === 0
      ? 0
      : Math.round((activeVehicles / activeFleet) * 100);

  const tripActivity: FleetActivityItem[] = recentTrips.map((trip) => {
    const route = `${trip.source} → ${trip.destination}`;
    const vehicleLabel = trip.vehicle.registrationNumber;

    if (trip.status === TripStatus.DISPATCHED) {
      return {
        id: `trip-${trip.id}-dispatch`,
        type: "dispatch" as const,
        description: `Trip dispatched — ${vehicleLabel} · ${route}`,
        timestamp: (trip.dispatchedAt ?? trip.updatedAt).toISOString(),
        status: trip.status,
      };
    }

    if (trip.status === TripStatus.COMPLETED) {
      return {
        id: `trip-${trip.id}-complete`,
        type: "trip" as const,
        description: `Trip completed — ${vehicleLabel} · ${route}`,
        timestamp: (trip.completedAt ?? trip.updatedAt).toISOString(),
        status: trip.status,
      };
    }

    if (trip.status === TripStatus.CANCELLED) {
      return {
        id: `trip-${trip.id}-cancel`,
        type: "trip" as const,
        description: `Trip cancelled — ${vehicleLabel} · ${route}`,
        timestamp: (trip.cancelledAt ?? trip.updatedAt).toISOString(),
        status: trip.status,
      };
    }

    return {
      id: `trip-${trip.id}-draft`,
      type: "trip" as const,
      description: `Draft trip ready — ${vehicleLabel} · ${trip.driver.name}`,
      timestamp: trip.createdAt.toISOString(),
      status: trip.status,
    };
  });

  const maintenanceActivity: FleetActivityItem[] = recentMaintenance.map(
    (record) => ({
      id: `maint-${record.id}`,
      type: "maintenance" as const,
      description: `${record.title} — ${record.vehicle.registrationNumber}`,
      timestamp: record.updatedAt.toISOString(),
      status: record.status,
    }),
  );

  const recentActivity = [...tripActivity, ...maintenanceActivity]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .slice(0, 8);

  return {
    kpis: {
      activeVehicles,
      availableVehicles,
      vehiclesInMaintenance,
      retiredVehicles,
      totalVehicles,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      fleetUtilization,
    },
    recentActivity,
  };
}
