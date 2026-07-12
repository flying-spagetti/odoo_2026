import type { Driver, Trip } from "@/generated/prisma/client";
import { TripStatus } from "@/generated/prisma/client";
import { startOfDay } from "date-fns";
import type { DriverListItem, DriverSafetyClearance } from "./driver.types";

type DriverWithTrips = Driver & {
  trips: Pick<Trip, "status">[];
};

function toSafetyClearance(status: Driver["status"]): DriverSafetyClearance {
  if (status === "SUSPENDED") {
    return "SUSPENDED";
  }

  if (status === "ON_TRIP") {
    return "ON_TRIP";
  }

  return "AVAILABLE";
}

function isLicenseExpired(licenseExpiryDate: Date, asOf = new Date()): boolean {
  return startOfDay(licenseExpiryDate) < startOfDay(asOf);
}

/**
 * Safety score is computed from operational facts — not a manual input.
 *
 * - Base 100 for a clean profile
 * - Suspended: hard cap at 25
 * - Expired licence: −35
 * - Trip history: blend remaining score with completion rate
 * - Cancellations reduce the completion-weighted component
 */
export function computeSafetyScore(input: {
  status: Driver["status"];
  licenseExpiryDate: Date;
  trips: Pick<Trip, "status">[];
  asOf?: Date;
}): number {
  const asOf = input.asOf ?? new Date();
  const licenseExpired = isLicenseExpired(input.licenseExpiryDate, asOf);

  if (input.status === "SUSPENDED") {
    return 25;
  }

  let score = 100;

  if (licenseExpired) {
    score -= 35;
  }

  const finishedTrips = input.trips.filter(
    (trip) =>
      trip.status === TripStatus.COMPLETED ||
      trip.status === TripStatus.CANCELLED,
  );

  if (finishedTrips.length === 0) {
    // New drivers with a valid licence start high; expired licence already penalised.
    return Math.max(0, Math.min(100, score));
  }

  const completedCount = finishedTrips.filter(
    (trip) => trip.status === TripStatus.COMPLETED,
  ).length;
  const completionRate = completedCount / finishedTrips.length;
  const historyScore = Math.round(completionRate * 100);

  // 40% standing (licence/status) + 60% trip reliability
  score = Math.round(score * 0.4 + historyScore * 0.6);

  return Math.max(0, Math.min(100, score));
}

function toTripCompletionPercent(
  trips: Pick<Trip, "status">[],
): number | null {
  const relevant = trips.filter(
    (trip) =>
      trip.status === TripStatus.COMPLETED ||
      trip.status === TripStatus.CANCELLED ||
      trip.status === TripStatus.DISPATCHED,
  );

  if (relevant.length === 0) {
    return null;
  }

  const completed = relevant.filter(
    (trip) => trip.status === TripStatus.COMPLETED,
  ).length;

  return Math.round((completed / relevant.length) * 100);
}

export function toDriverListItem(driver: DriverWithTrips): DriverListItem {
  return {
    id: driver.id,
    name: driver.name,
    licenseNumber: driver.licenseNumber,
    licenseCategory: driver.licenseCategory,
    licenseExpiryDate: driver.licenseExpiryDate.toISOString(),
    contactNumber: driver.contactNumber,
    tripCompletionPercent: toTripCompletionPercent(driver.trips),
    safetyScore: computeSafetyScore({
      status: driver.status,
      licenseExpiryDate: driver.licenseExpiryDate,
      trips: driver.trips,
    }),
    safetyClearance: toSafetyClearance(driver.status),
    status: driver.status,
  };
}
