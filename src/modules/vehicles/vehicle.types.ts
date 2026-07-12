import type { VehicleStatus, VehicleType } from "@/generated/prisma/client";

export type VehicleFailureCode =
  | "VALIDATION_ERROR"
  | "DUPLICATE_REGISTRATION"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "UNKNOWN_ERROR";

export type VehicleFailure = {
  code: VehicleFailureCode;
  message: string;
};

export type VehicleActionSuccess<T> = {
  success: true;
  data: T;
};

export type VehicleActionFailure = {
  success: false;
  error: VehicleFailure;
};

export type VehicleActionResult<T> =
  | VehicleActionSuccess<T>
  | VehicleActionFailure;

export type VehicleListItem = {
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
  region: string | null;
};

export type CreateVehicleInput = {
  registrationNumber: string;
  name: string;
  model: string;
  type: VehicleType;
  maxLoadKg: number;
  odometerKm: number;
  acquisitionCostRupees: number;
  region?: string;
};
