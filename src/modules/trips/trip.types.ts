import type {
  DriverStatus,
  TripStatus,
  VehicleStatus,
} from "@/generated/prisma/client";

export type ReadinessCheckCode =
  | "TRIP_DRAFT"
  | "VEHICLE_AVAILABLE"
  | "DRIVER_AVAILABLE"
  | "DRIVER_LICENCE_VALID"
  | "CARGO_CAPACITY"
  | "VEHICLE_NOT_DISPATCHED_ELSEWHERE"
  | "DRIVER_NOT_DISPATCHED_ELSEWHERE";

export type ReadinessCheck = {
  code: ReadinessCheckCode;
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

export type CreateTripInput = {
  source: string;
  destination: string;
  cargoWeightKg: number;
  plannedDistanceKm: number;
  vehicleId: string;
  driverId: string;
};

export type TripVehicleOption = {
  id: string;
  name: string;
  registrationNumber: string;
  maxLoadKg: number;
  odometerKm: number;
};

export type TripDriverOption = {
  id: string;
  name: string;
  licenseNumber: string;
  licenseExpiryDate: string;
};

export type TripFailureDetails = {
  readiness?: DispatchReadiness;
};

export type TripFailureCode =
  | "TRIP_NOT_FOUND"
  | "INVALID_TRIP_STATE"
  | "DISPATCH_BLOCKED"
  | "VEHICLE_NOT_FOUND"
  | "DRIVER_NOT_FOUND"
  | "VEHICLE_UNAVAILABLE"
  | "DRIVER_UNAVAILABLE"
  | "INVALID_ODOMETER"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "UNKNOWN_ERROR";

export type TripFailure = {
  code: TripFailureCode;
  message: string;
  details?: TripFailureDetails;
};

export type TripActionSuccess<T> = {
  success: true;
  data: T;
};

export type TripActionFailure = {
  success: false;
  error: TripFailure;
};

export type TripActionResult<T> = TripActionSuccess<T> | TripActionFailure;

export type TripResourceSummary = {
  id: string;
  name: string;
  status: VehicleStatus | DriverStatus;
  detailLabel: string;
};

export type TripBoardItem = {
  id: string;
  tripCode: string;
  source: string;
  destination: string;
  status: TripStatus;
  cargoWeightKg: number;
  plannedDistanceKm: number;
  vehicle: TripResourceSummary;
  driver: TripResourceSummary;
  boardNote: string;
  updatedAt: string;
};

export type TripDetailView = {
  id: string;
  tripCode: string;
  source: string;
  destination: string;
  status: TripStatus;
  cargoWeightKg: number;
  plannedDistanceKm: number;
  vehicle: TripResourceSummary & { maxLoadKg: number; odometerKm: number };
  driver: TripResourceSummary & { licenseExpiryDate: string };
  dispatchedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
};