import type { VehicleStatus } from "./status";

export type VehicleType = "TRUCK" | "VAN" | "BUS" | "TRAILER";

export interface Vehicle {
  id: string;
  registrationNumber: string;
  name: string;
  model: string;
  type: VehicleType;
  typeLabel: string;
  capacityLabel: string;
  odometerKm: number;
  acquisitionCost: number;
  status: VehicleStatus;
}

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  TRUCK: "Truck",
  VAN: "Van",
  BUS: "Bus",
  TRAILER: "Trailer",
};

export const VEHICLE_REGISTRY_TYPE_FILTERS = [
  "All",
  "Van",
  "Truck",
  "Mini",
  "Bus",
  "Trailer",
] as const;

export type VehicleRegistryTypeFilter =
  (typeof VEHICLE_REGISTRY_TYPE_FILTERS)[number];
