import {
  DriverStatus,
  TripStatus,
  VehicleStatus,
} from "@/generated/prisma/client";
import { startOfDay } from "date-fns";
import type {
  DispatchReadiness,
  DispatchReadinessFacts,
  ReadinessCheckCode,
} from "./trip.types";

export function markCheckFailed(
  readiness: DispatchReadiness,
  code: ReadinessCheckCode,
  reason: string,
): DispatchReadiness {
  const checks = readiness.checks.map((check) =>
    check.code === code ? { ...check, passed: false, reason } : check,
  );

  return {
    ready: false,
    checks,
  };
}

function vehicleStatusReason(status: VehicleStatus): string {
  switch (status) {
    case VehicleStatus.IN_SHOP:
      return "Vehicle is under maintenance.";
    case VehicleStatus.RETIRED:
      return "Vehicle is retired.";
    case VehicleStatus.ON_TRIP:
      return "Vehicle is already on a trip.";
    default:
      return `Vehicle status is ${status}.`;
  }
}

function driverStatusReason(status: DriverStatus): string {
  switch (status) {
    case DriverStatus.SUSPENDED:
      return "Driver is suspended.";
    case DriverStatus.OFF_DUTY:
      return "Driver is off duty.";
    case DriverStatus.ON_TRIP:
      return "Driver is already on a trip.";
    default:
      return `Driver status is ${status}.`;
  }
}

export function evaluateDispatchReadiness(
  facts: DispatchReadinessFacts,
): DispatchReadiness {
  const asOf = facts.asOf ?? new Date();
  const licenceValid =
    startOfDay(facts.licenseExpiryDate) >= startOfDay(asOf);
  const cargoWithinCapacity = facts.cargoWeightKg <= facts.vehicleMaxLoadKg;

  const checks: DispatchReadiness["checks"] = [
    {
      code: "TRIP_DRAFT",
      label: "Trip is in draft status",
      passed: facts.tripStatus === TripStatus.DRAFT,
      reason:
        facts.tripStatus === TripStatus.DRAFT
          ? undefined
          : `Trip status is ${facts.tripStatus}.`,
    },
    {
      code: "VEHICLE_AVAILABLE",
      label: "Vehicle is available",
      passed: facts.vehicleStatus === VehicleStatus.AVAILABLE,
      reason:
        facts.vehicleStatus === VehicleStatus.AVAILABLE
          ? undefined
          : vehicleStatusReason(facts.vehicleStatus),
    },
    {
      code: "DRIVER_AVAILABLE",
      label: "Driver is available",
      passed: facts.driverStatus === DriverStatus.AVAILABLE,
      reason:
        facts.driverStatus === DriverStatus.AVAILABLE
          ? undefined
          : driverStatusReason(facts.driverStatus),
    },
    {
      code: "DRIVER_LICENCE_VALID",
      label: "Driver licence is valid",
      passed: licenceValid,
      reason: licenceValid
        ? undefined
        : "Driver licence has expired.",
    },
    {
      code: "CARGO_CAPACITY",
      label: "Cargo weight is within vehicle capacity",
      passed: cargoWithinCapacity,
      reason: cargoWithinCapacity
        ? undefined
        : `Cargo weight (${facts.cargoWeightKg} kg) exceeds vehicle capacity (${facts.vehicleMaxLoadKg} kg).`,
    },
    {
      code: "VEHICLE_NOT_DISPATCHED_ELSEWHERE",
      label: "Vehicle is not assigned to another dispatched trip",
      passed: !facts.vehicleDispatchedElsewhere,
      reason: facts.vehicleDispatchedElsewhere
        ? "Vehicle is already assigned to another dispatched trip."
        : undefined,
    },
    {
      code: "DRIVER_NOT_DISPATCHED_ELSEWHERE",
      label: "Driver is not assigned to another dispatched trip",
      passed: !facts.driverDispatchedElsewhere,
      reason: facts.driverDispatchedElsewhere
        ? "Driver is already assigned to another dispatched trip."
        : undefined,
    },
  ];

  return {
    ready: checks.every((check) => check.passed),
    checks,
  };
}
