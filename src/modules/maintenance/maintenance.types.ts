import type { MaintenanceStatus, VehicleStatus } from "@/generated/prisma/client";

export type MaintenanceFailureCode =
  | "MAINTENANCE_NOT_FOUND"
  | "VEHICLE_NOT_FOUND"
  | "VEHICLE_RETIRED"
  | "VEHICLE_ON_TRIP"
  | "ACTIVE_MAINTENANCE_EXISTS"
  | "INVALID_MAINTENANCE_STATE"
  | "VEHICLE_UNAVAILABLE"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "UNKNOWN_ERROR";

export type MaintenanceFailure = {
  code: MaintenanceFailureCode;
  message: string;
};

export type MaintenanceActionSuccess<T> = {
  success: true;
  data: T;
};

export type MaintenanceActionFailure = {
  success: false;
  error: MaintenanceFailure;
};

export type MaintenanceActionResult<T> =
  | MaintenanceActionSuccess<T>
  | MaintenanceActionFailure;

export type MaintenanceVehicleSummary = {
  id: string;
  name: string;
  registrationNumber: string;
  status: VehicleStatus;
};

export type MaintenanceListItem = {
  id: string;
  vehicleId: string;
  title: string;
  description: string;
  priority: string;
  status: MaintenanceStatus;
  estimatedCostPaise: number | null;
  actualCostPaise: number | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  vehicle: MaintenanceVehicleSummary;
};

export type MaintenanceDetailView = MaintenanceListItem;

export type EligibleVehicleOption = {
  id: string;
  name: string;
  registrationNumber: string;
  maxLoadKg: number;
  odometerKm: number;
};

export type CreateMaintenanceInput = {
  vehicleId: string;
  title: string;
  description: string;
  priority: string;
  estimatedCostPaise?: number;
};

export type CloseMaintenanceInput = {
  actualCostPaise?: number;
};
