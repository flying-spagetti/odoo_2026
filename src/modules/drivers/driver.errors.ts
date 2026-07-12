import { ZodError } from "zod";
import { isTripDomainError } from "@/modules/trips/trip.errors";
import type { DriverFailure, DriverFailureCode } from "./driver.types";

export type DriverErrorCode = Exclude<DriverFailureCode, "UNKNOWN_ERROR">;

export class DriverDomainError extends Error {
  readonly code: DriverErrorCode;

  constructor(code: DriverErrorCode, message: string) {
    super(message);
    this.name = "DriverDomainError";
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function isDriverDomainError(
  error: unknown,
): error is DriverDomainError {
  return error instanceof DriverDomainError;
}

export function toDriverFailure(error: unknown): DriverFailure {
  if (isDriverDomainError(error)) {
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
