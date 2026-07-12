import type {
  DriverStatus,
  TripStatus,
  VehicleStatus,
} from "@/generated/prisma/client";

export type ReadinessCheck = {
  code: string;
  label: string;
  passed: boolean;
  reason?: string;
};

export type DispatchReadiness = {
  ready: boolean;
  checks: ReadinessCheck[];
};

export type DispatchReadinessFacts = {
  tripStatus: TripStatus;
  vehicleStatus: VehicleStatus;
  driverStatus: DriverStatus;
  licenseExpiryDate: Date;
  cargoWeightKg: number;
  vehicleMaxLoadKg: number;
  vehicleDispatchedElsewhere: boolean;
  driverDispatchedElsewhere: boolean;
  asOf?: Date;
};

export type CompleteTripInput = {
  finalOdometerKm?: number;
};
