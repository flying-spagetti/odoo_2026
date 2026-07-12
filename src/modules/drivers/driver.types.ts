import type { DriverStatus } from "@/generated/prisma/client";

export type DriverFailureCode =
  | "VALIDATION_ERROR"
  | "DUPLICATE_LICENSE"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "UNKNOWN_ERROR";

export type DriverFailure = {
  code: DriverFailureCode;
  message: string;
};

export type DriverActionSuccess<T> = {
  success: true;
  data: T;
};

export type DriverActionFailure = {
  success: false;
  error: DriverFailure;
};

export type DriverActionResult<T> =
  | DriverActionSuccess<T>
  | DriverActionFailure;

export type DriverSafetyClearance = "AVAILABLE" | "ON_TRIP" | "SUSPENDED";

export type DriverListItem = {
  id: string;
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: string;
  contactNumber: string;
  tripCompletionPercent: number | null;
  safetyScore: number;
  safetyClearance: DriverSafetyClearance;
  status: DriverStatus;
};

export type CreateDriverInput = {
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: string;
  contactNumber: string;
};
