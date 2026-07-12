import type { MaintenanceRecord, Vehicle } from "@/generated/prisma/client";
import type {
  EligibleVehicleOption,
  MaintenanceDetailView,
  MaintenanceListItem,
  MaintenanceVehicleSummary,
} from "./maintenance.types";

type MaintenanceWithVehicle = MaintenanceRecord & {
  vehicle: Vehicle;
};

function toMaintenanceVehicleSummary(
  vehicle: Vehicle,
): MaintenanceVehicleSummary {
  return {
    id: vehicle.id,
    name: vehicle.name,
    registrationNumber: vehicle.registrationNumber,
    status: vehicle.status,
  };
}

export function toMaintenanceListItem(
  record: MaintenanceWithVehicle,
): MaintenanceListItem {
  return {
    id: record.id,
    vehicleId: record.vehicleId,
    title: record.title,
    description: record.description,
    priority: record.priority,
    status: record.status,
    estimatedCostPaise: record.estimatedCostPaise,
    actualCostPaise: record.actualCostPaise,
    startedAt: record.startedAt?.toISOString() ?? null,
    completedAt: record.completedAt?.toISOString() ?? null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    vehicle: toMaintenanceVehicleSummary(record.vehicle),
  };
}

export function toMaintenanceDetailView(
  record: MaintenanceWithVehicle,
): MaintenanceDetailView {
  return toMaintenanceListItem(record);
}

export function toEligibleVehicleOption(vehicle: Vehicle): EligibleVehicleOption {
  return {
    id: vehicle.id,
    name: vehicle.name,
    registrationNumber: vehicle.registrationNumber,
    maxLoadKg: vehicle.maxLoadKg,
    odometerKm: vehicle.odometerKm,
  };
}
