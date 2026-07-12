import { ZodError } from "zod";
import { isTripDomainError } from "@/modules/trips/trip.errors";
import type { VehicleFailure, VehicleFailureCode } from "./vehicle.types";

export type VehicleErrorCode = Exclude<VehicleFailureCode, "UNKNOWN_ERROR">;

export class VehicleDomainError extends Error {
  readonly code: VehicleErrorCode;

  constructor(code: VehicleErrorCode, message: string) {
    super(message);
    this.name = "VehicleDomainError";
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function isVehicleDomainError(
  error: unknown,
): error is VehicleDomainError {
  return error instanceof VehicleDomainError;
}

export function toVehicleFailure(error: unknown): VehicleFailure {
  if (isVehicleDomainError(error)) {
    return {
      code: error.code,
      message: error.message,
    };
  }

  if (isTripDomainError(error)) {
    if (error.code === "UNAUTHORIZED" || error.code === "FORBIDDEN") {
      return {
        code: error.code,
        message: error.message,
      };
    }
  }

  if (error instanceof ZodError) {
    return {
      code: "VALIDATION_ERROR",
      message: error.issues
        .map((issue) => {
          const field = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
          return `${field}${issue.message}`;
        })
        .join(" "),
    };
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "issues" in error &&
    Array.isArray((error as { issues: unknown }).issues)
  ) {
    const issues = (
      error as { issues: Array<{ message: string; path?: PropertyKey[] }> }
    ).issues;
    return {
      code: "VALIDATION_ERROR",
      message: issues
        .map((issue) => {
          const field =
            issue.path && issue.path.length > 0
              ? `${issue.path.map(String).join(".")}: `
              : "";
          return `${field}${issue.message}`;
        })
        .join(" "),
    };
  }

  if (error instanceof Error) {
    return {
      code: "UNKNOWN_ERROR",
      message: "An unexpected error occurred.",
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "An unexpected error occurred.",
  };
}
