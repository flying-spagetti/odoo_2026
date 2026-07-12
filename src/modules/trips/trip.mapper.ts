import type { Driver, Trip, Vehicle } from "@/generated/prisma/client";
import type { TripBoardItem, TripDetailView, TripResourceSummary } from "./trip.types";

type TripWithRelations = Trip & {
  vehicle: Vehicle;
  driver: Driver;
};

const SEED_TRIP_CODES: Record<string, string> = {
  "seed-trip-draft": "TR001",
  "seed-trip-dispatched": "TR002",
  "seed-trip-blocked": "TR004",
  "seed-trip-cancelled": "TR006",
};

const SEED_BOARD_NOTES: Record<string, string> = {
  "seed-trip-draft": "Ready for dispatch",
  "seed-trip-dispatched": "In transit",
  "seed-trip-blocked": "Awaiting validation",
  "seed-trip-cancelled": "Vehicle went to shop",
};

function formatTripCode(tripId: string): string {
  return SEED_TRIP_CODES[tripId] ?? `TR-${tripId.slice(-6).toUpperCase()}`;
}

function formatVehicleLabel(vehicle: Vehicle): string {
  return `${vehicle.name} · ${vehicle.maxLoadKg} kg capacity`;
}

function formatDriverLabel(driver: Driver): string {
  return driver.name;
}

function toVehicleSummary(vehicle: Vehicle): TripResourceSummary {
  return {
    id: vehicle.id,
    name: vehicle.name,
    status: vehicle.status,
    detailLabel: formatVehicleLabel(vehicle),
  };
}

function toDriverSummary(driver: Driver): TripResourceSummary {
  return {
    id: driver.id,
    name: driver.name,
    status: driver.status,
    detailLabel: formatDriverLabel(driver),
  };
}

function boardNoteForTrip(trip: TripWithRelations): string {
  if (SEED_BOARD_NOTES[trip.id]) {
    return SEED_BOARD_NOTES[trip.id];
  }

  switch (trip.status) {
    case "DRAFT":
      return "Awaiting dispatch";
    case "DISPATCHED":
      return `${trip.plannedDistanceKm} km planned`;
    case "COMPLETED":
      return "Trip completed";
    case "CANCELLED":
      return "Trip cancelled";
    default:
      return "";
  }
}

export function toTripBoardItem(trip: TripWithRelations): TripBoardItem {
  return {
    id: trip.id,
    tripCode: formatTripCode(trip.id),
    source: trip.source,
    destination: trip.destination,
    status: trip.status,
    cargoWeightKg: trip.cargoWeightKg,
    plannedDistanceKm: trip.plannedDistanceKm,
    vehicle: toVehicleSummary(trip.vehicle),
    driver: toDriverSummary(trip.driver),
    boardNote: boardNoteForTrip(trip),
    updatedAt: trip.updatedAt.toISOString(),
  };
}

export function toTripDetailView(trip: TripWithRelations): TripDetailView {
  return {
    id: trip.id,
    tripCode: formatTripCode(trip.id),
    source: trip.source,
    destination: trip.destination,
    status: trip.status,
    cargoWeightKg: trip.cargoWeightKg,
    plannedDistanceKm: trip.plannedDistanceKm,
    vehicle: {
      ...toVehicleSummary(trip.vehicle),
      maxLoadKg: trip.vehicle.maxLoadKg,
    },
    driver: {
      ...toDriverSummary(trip.driver),
      licenseExpiryDate: trip.driver.licenseExpiryDate.toISOString(),
    },
    dispatchedAt: trip.dispatchedAt?.toISOString() ?? null,
    completedAt: trip.completedAt?.toISOString() ?? null,
    cancelledAt: trip.cancelledAt?.toISOString() ?? null,
  };
}
