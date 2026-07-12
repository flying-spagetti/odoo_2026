import type { Driver, Trip } from "@/generated/prisma/client";
import { TripStatus } from "@/generated/prisma/client";
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
    safetyScore: driver.safetyScore,
    safetyClearance: toSafetyClearance(driver.status),
    status: driver.status,
  };
}
