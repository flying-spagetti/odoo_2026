import type { Vehicle } from "@/generated/prisma/client";
import { VEHICLE_TYPE_LABELS } from "@/types/vehicle";
import type { VehicleListItem } from "./vehicle.types";

function formatCapacityLabel(maxLoadKg: number): string {
  return `${maxLoadKg.toLocaleString("en-IN")} kg`;
}

export function toVehicleListItem(vehicle: Vehicle): VehicleListItem {
  return {
    id: vehicle.id,
    registrationNumber: vehicle.registrationNumber,
    name: vehicle.name,
    model: vehicle.model,
    type: vehicle.type,
    typeLabel: VEHICLE_TYPE_LABELS[vehicle.type],
    capacityLabel: formatCapacityLabel(vehicle.maxLoadKg),
    odometerKm: vehicle.odometerKm,
    acquisitionCost: Math.round(vehicle.acquisitionCostPaise / 100),
    status: vehicle.status,
    region: vehicle.region,
  };
}
