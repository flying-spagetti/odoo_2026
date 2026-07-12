import {
  MaintenanceStatus,
  TripStatus,
  VehicleStatus,
  type Prisma,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { MaintenanceDomainError } from "./maintenance.errors";
import {
  toEligibleVehicleOption,
  toMaintenanceDetailView,
  toMaintenanceListItem,
} from "./maintenance.mapper";
import type {
  CloseMaintenanceInput,
  CreateMaintenanceInput,
  EligibleVehicleOption,
  MaintenanceDetailView,
  MaintenanceListItem,
} from "./maintenance.types";

const ACTIVE_MAINTENANCE_STATUSES: MaintenanceStatus[] = [
  MaintenanceStatus.OPEN,
  MaintenanceStatus.IN_PROGRESS,
];

const maintenanceWithVehicleInclude = {
  vehicle: true,
} as const;

type MaintenanceTx = Prisma.TransactionClient;

async function findActiveMaintenanceForVehicle(
  tx: MaintenanceTx,
  vehicleId: string,
  excludeRecordId?: string,
) {
  return tx.maintenanceRecord.findFirst({
    where: {
      vehicleId,
      status: { in: ACTIVE_MAINTENANCE_STATUSES },
      ...(excludeRecordId ? { id: { not: excludeRecordId } } : {}),
    },
    select: { id: true },
  });
}

async function loadMaintenanceDetail(
  tx: MaintenanceTx,
  recordId: string,
): Promise<MaintenanceDetailView> {
  const record = await tx.maintenanceRecord.findUnique({
    where: { id: recordId },
    include: maintenanceWithVehicleInclude,
  });

  if (!record) {
    throw new MaintenanceDomainError(
      "MAINTENANCE_NOT_FOUND",
      `Maintenance record ${recordId} was not found.`,
    );
  }

  return toMaintenanceDetailView(record);
}

export async function listMaintenanceRecords(): Promise<MaintenanceListItem[]> {
  const records = await prisma.maintenanceRecord.findMany({
    include: maintenanceWithVehicleInclude,
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });

  return records.map(toMaintenanceListItem);
}

export async function getMaintenanceDetail(
  recordId: string,
): Promise<MaintenanceDetailView> {
  const record = await prisma.maintenanceRecord.findUnique({
    where: { id: recordId },
    include: maintenanceWithVehicleInclude,
  });

  if (!record) {
    throw new MaintenanceDomainError(
      "MAINTENANCE_NOT_FOUND",
      `Maintenance record ${recordId} was not found.`,
    );
  }

  return toMaintenanceDetailView(record);
}

export async function listEligibleVehiclesForMaintenance(): Promise<
  EligibleVehicleOption[]
> {
  const vehicles = await prisma.vehicle.findMany({
    where: {
      status: VehicleStatus.AVAILABLE,
      maintenanceRecords: {
        none: {
          status: { in: ACTIVE_MAINTENANCE_STATUSES },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return vehicles.map(toEligibleVehicleOption);
}

export async function createMaintenanceRecord(
  input: CreateMaintenanceInput,
): Promise<MaintenanceDetailView> {
  return prisma.$transaction(async (tx) => {
    const vehicle = await tx.vehicle.findUnique({
      where: { id: input.vehicleId },
    });

    if (!vehicle) {
      throw new MaintenanceDomainError(
        "VEHICLE_NOT_FOUND",
        `Vehicle ${input.vehicleId} was not found.`,
      );
    }

    if (vehicle.status === VehicleStatus.RETIRED) {
      throw new MaintenanceDomainError(
        "VEHICLE_RETIRED",
        "Retired vehicles cannot enter maintenance.",
      );
    }

    if (vehicle.status === VehicleStatus.ON_TRIP) {
      throw new MaintenanceDomainError(
        "VEHICLE_ON_TRIP",
        "Vehicles on trip cannot enter maintenance.",
      );
    }

    const dispatchedTrip = await tx.trip.findFirst({
      where: {
        vehicleId: input.vehicleId,
        status: TripStatus.DISPATCHED,
      },
      select: { id: true },
    });

    if (dispatchedTrip) {
      throw new MaintenanceDomainError(
        "VEHICLE_UNAVAILABLE",
        "Vehicle is assigned to a dispatched trip.",
      );
    }

    const activeMaintenance = await findActiveMaintenanceForVehicle(
      tx,
      input.vehicleId,
    );

    if (activeMaintenance) {
      throw new MaintenanceDomainError(
        "ACTIVE_MAINTENANCE_EXISTS",
        "Vehicle already has an active maintenance record.",
      );
    }

    const vehicleClaim = await tx.vehicle.updateMany({
      where: {
        id: input.vehicleId,
        status: VehicleStatus.AVAILABLE,
      },
      data: {
        status: VehicleStatus.IN_SHOP,
      },
    });

    if (vehicleClaim.count !== 1) {
      throw new MaintenanceDomainError(
        "VEHICLE_UNAVAILABLE",
        "Vehicle is no longer available for maintenance.",
      );
    }

    const record = await tx.maintenanceRecord.create({
      data: {
        vehicleId: input.vehicleId,
        title: input.title,
        description: input.description,
        priority: input.priority,
        estimatedCostPaise: input.estimatedCostPaise,
        status: MaintenanceStatus.OPEN,
      },
      include: maintenanceWithVehicleInclude,
    });

    return toMaintenanceDetailView(record);
  });
}

export async function startMaintenance(
  recordId: string,
): Promise<MaintenanceDetailView> {
  return prisma.$transaction(async (tx) => {
    const record = await tx.maintenanceRecord.findUnique({
      where: { id: recordId },
      include: maintenanceWithVehicleInclude,
    });

    if (!record) {
      throw new MaintenanceDomainError(
        "MAINTENANCE_NOT_FOUND",
        `Maintenance record ${recordId} was not found.`,
      );
    }

    if (record.status !== MaintenanceStatus.OPEN) {
      throw new MaintenanceDomainError(
        "INVALID_MAINTENANCE_STATE",
        `Only open maintenance records can be started. Current status: ${record.status}.`,
      );
    }

    if (record.vehicle.status !== VehicleStatus.IN_SHOP) {
      throw new MaintenanceDomainError(
        "VEHICLE_UNAVAILABLE",
        `Vehicle must be In Shop to start maintenance. Current status: ${record.vehicle.status}.`,
      );
    }

    const startedAt = new Date();
    const recordUpdate = await tx.maintenanceRecord.updateMany({
      where: {
        id: recordId,
        status: MaintenanceStatus.OPEN,
      },
      data: {
        status: MaintenanceStatus.IN_PROGRESS,
        startedAt,
      },
    });

    if (recordUpdate.count !== 1) {
      throw new MaintenanceDomainError(
        "INVALID_MAINTENANCE_STATE",
        "Maintenance record is no longer open.",
      );
    }

    return loadMaintenanceDetail(tx, recordId);
  });
}

export async function closeMaintenance(
  recordId: string,
  input: CloseMaintenanceInput = {},
): Promise<MaintenanceDetailView> {
  return prisma.$transaction(async (tx) => {
    const record = await tx.maintenanceRecord.findUnique({
      where: { id: recordId },
      include: maintenanceWithVehicleInclude,
    });

    if (!record) {
      throw new MaintenanceDomainError(
        "MAINTENANCE_NOT_FOUND",
        `Maintenance record ${recordId} was not found.`,
      );
    }

    if (record.status !== MaintenanceStatus.IN_PROGRESS) {
      throw new MaintenanceDomainError(
        "INVALID_MAINTENANCE_STATE",
        `Only in-progress maintenance records can be closed. Current status: ${record.status}.`,
      );
    }

    const completedAt = new Date();
    const recordUpdate = await tx.maintenanceRecord.updateMany({
      where: {
        id: recordId,
        status: MaintenanceStatus.IN_PROGRESS,
      },
      data: {
        status: MaintenanceStatus.CLOSED,
        completedAt,
        ...(input.actualCostPaise !== undefined
          ? { actualCostPaise: input.actualCostPaise }
          : {}),
      },
    });

    if (recordUpdate.count !== 1) {
      throw new MaintenanceDomainError(
        "INVALID_MAINTENANCE_STATE",
        "Maintenance record is no longer in progress.",
      );
    }

    if (record.vehicle.status === VehicleStatus.IN_SHOP) {
      const vehicleUpdate = await tx.vehicle.updateMany({
        where: {
          id: record.vehicleId,
          status: VehicleStatus.IN_SHOP,
        },
        data: {
          status: VehicleStatus.AVAILABLE,
        },
      });

      if (vehicleUpdate.count !== 1) {
        throw new MaintenanceDomainError(
          "VEHICLE_UNAVAILABLE",
          "Vehicle could not be restored to Available.",
        );
      }
    } else if (record.vehicle.status === VehicleStatus.RETIRED) {
      // Leave vehicle RETIRED; maintenance record still closes.
    } else {
      throw new MaintenanceDomainError(
        "VEHICLE_UNAVAILABLE",
        `Vehicle cannot be restored after maintenance. Current status: ${record.vehicle.status}.`,
      );
    }

    return loadMaintenanceDetail(tx, recordId);
  });
}
