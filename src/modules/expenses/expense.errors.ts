import { ZodError } from "zod";
import { isTripDomainError } from "@/modules/trips/trip.errors";
import type { ExpenseFailure, ExpenseFailureCode } from "./expense.types";

export type ExpenseErrorCode = Exclude<ExpenseFailureCode, "UNKNOWN_ERROR">;

export class ExpenseDomainError extends Error {
  readonly code: ExpenseErrorCode;

  constructor(code: ExpenseErrorCode, message: string) {
    super(message);
    this.name = "ExpenseDomainError";
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function isExpenseDomainError(
  error: unknown,
): error is ExpenseDomainError {
  return error instanceof ExpenseDomainError;
}

export function toExpenseFailure(error: unknown): ExpenseFailure {
  if (isExpenseDomainError(error)) {
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
