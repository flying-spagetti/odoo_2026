import type { DriverStatus } from "@/types/status";

export type DriverSafetyClearance = "AVAILABLE" | "ON_TRIP" | "SUSPENDED";

export interface Driver {
  id: string;
  name: string;
  licenceNumber: string;
  licenceCategory: string;
  licenceExpiry: string;
  contactNumber: string;
  tripCompletionPercent: number | null;
  safetyScore: number;
  safetyClearance: DriverSafetyClearance;
  status: DriverStatus;
}

export function getDriverSafetyClearance(
  status: DriverStatus,
): DriverSafetyClearance {
  if (status === "SUSPENDED") {
    return "SUSPENDED";
  }

  if (status === "ON_TRIP") {
    return "ON_TRIP";
  }

  return "AVAILABLE";
}

export function maskContactNumber(contactNumber: string): string {
  const digits = contactNumber.replace(/\D/g, "");

  if (digits.length < 5) {
    return contactNumber;
  }

  return `${digits.slice(0, 5)}${"x".repeat(Math.max(digits.length - 5, 5))}`;
}
