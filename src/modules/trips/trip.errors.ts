import { ZodError } from "zod";
import type { TripFailure, TripFailureDetails } from "./trip.types";

export type TripErrorCode =
  | "TRIP_NOT_FOUND"
  | "INVALID_TRIP_STATE"
  | "DISPATCH_BLOCKED"
  | "VEHICLE_UNAVAILABLE"
  | "DRIVER_UNAVAILABLE"
  | "INVALID_ODOMETER"
  | "UNAUTHORIZED"
  | "FORBIDDEN";

export type TripErrorDetails = TripFailureDetails;

export class TripDomainError extends Error {
  readonly code: TripErrorCode;
  readonly details?: TripErrorDetails;

  constructor(
    code: TripErrorCode,
    message: string,
    details?: TripErrorDetails,
  ) {
    super(message);
    this.name = "TripDomainError";
    this.code = code;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function isTripDomainError(error: unknown): error is TripDomainError {
  return error instanceof TripDomainError;
}

export function toTripFailure(error: unknown): TripFailure {
  if (isTripDomainError(error)) {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
    };
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
    const issues = (error as { issues: Array<{ message: string; path?: PropertyKey[] }> }).issues;
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