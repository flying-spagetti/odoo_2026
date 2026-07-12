import type { VehicleStatus } from "./status";

export type VehicleType = "TRUCK" | "VAN" | "BUS" | "TRAILER";

export interface Vehicle {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  type: VehicleType;
  capacityKg: number;
  odometerKm: number;
  status: VehicleStatus;
}

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  TRUCK: "Truck",
  VAN: "Van",
  BUS: "Bus",
  TRAILER: "Trailer",
};
