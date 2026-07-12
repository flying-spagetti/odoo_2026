import { DriverStatus, TripStatus, VehicleStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { evaluateDispatchReadiness } from "./trip-readiness";
import { TripDomainError } from "./trip.errors";
import { completeTripInputSchema } from "./trip.schema";
import type { CompleteTripInput, DispatchReadiness } from "./trip.types";

async function findOtherDispatchedTrip(
  vehicleId: string,
  driverId: string,
  excludeTripId: string,
) {
  const [vehicleTrip, driverTrip] = await Promise.all([
    prisma.trip.findFirst({
      where: {
        id: { not: excludeTripId },
        vehicleId,
        status: TripStatus.DISPATCHED,
      },
      select: { id: true },
    }),
    prisma.trip.findFirst({
      where: {
        id: { not: excludeTripId },
        driverId,
        status: TripStatus.DISPATCHED,
      },
      select: { id: true },
    }),
  ]);

  return {
    vehicleDispatchedElsewhere: vehicleTrip !== null,
    driverDispatchedElsewhere: driverTrip !== null,
  };
}

export async function getDispatchReadiness(
  tripId: string,
): Promise<DispatchReadiness> {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      vehicle: true,
      driver: true,
    },
  });

  if (!trip) {
    throw new TripDomainError("TRIP_NOT_FOUND", `Trip ${tripId} was not found.`);
  }

  const dispatchConflicts = await findOtherDispatchedTrip(
    trip.vehicleId,
    trip.driverId,
    trip.id,
  );

  return evaluateDispatchReadiness({
    tripStatus: trip.status,
    vehicleStatus: trip.vehicle.status,
    driverStatus: trip.driver.status,
    licenseExpiryDate: trip.driver.licenseExpiryDate,
    cargoWeightKg: trip.cargoWeightKg,
    vehicleMaxLoadKg: trip.vehicle.maxLoadKg,
    vehicleDispatchedElsewhere: dispatchConflicts.vehicleDispatchedElsewhere,
    driverDispatchedElsewhere: dispatchConflicts.driverDispatchedElsewhere,
  });
}

export async function dispatchTrip(tripId: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({
      where: { id: tripId },
      include: {
        vehicle: true,
        driver: true,
      },
    });

    if (!trip) {
      throw new TripDomainError(
        "TRIP_NOT_FOUND",
        `Trip ${tripId} was not found.`,
      );
    }

    const [vehicleTrip, driverTrip] = await Promise.all([
      tx.trip.findFirst({
        where: {
          id: { not: tripId },
          vehicleId: trip.vehicleId,
          status: TripStatus.DISPATCHED,
        },
        select: { id: true },
      }),
      tx.trip.findFirst({
        where: {
          id: { not: tripId },
          driverId: trip.driverId,
          status: TripStatus.DISPATCHED,
        },
        select: { id: true },
      }),
    ]);

    const readiness = evaluateDispatchReadiness({
      tripStatus: trip.status,
      vehicleStatus: trip.vehicle.status,
      driverStatus: trip.driver.status,
      licenseExpiryDate: trip.driver.licenseExpiryDate,
      cargoWeightKg: trip.cargoWeightKg,
      vehicleMaxLoadKg: trip.vehicle.maxLoadKg,
      vehicleDispatchedElsewhere: vehicleTrip !== null,
      driverDispatchedElsewhere: driverTrip !== null,
    });

    if (!readiness.ready) {
      const failedChecks = readiness.checks
        .filter((check) => !check.passed)
        .map((check) => check.reason ?? check.label)
        .join(" ");

      throw new TripDomainError(
        "DISPATCH_BLOCKED",
        `Dispatch blocked: ${failedChecks}`,
      );
    }

    const vehicleClaim = await tx.vehicle.updateMany({
      where: {
        id: trip.vehicleId,
        status: VehicleStatus.AVAILABLE,
      },
      data: { status: VehicleStatus.ON_TRIP },
    });

    if (vehicleClaim.count !== 1) {
      throw new TripDomainError(
        "VEHICLE_UNAVAILABLE",
        "Vehicle is no longer available for dispatch.",
      );
    }

    const driverClaim = await tx.driver.updateMany({
      where: {
        id: trip.driverId,
        status: DriverStatus.AVAILABLE,
      },
      data: { status: DriverStatus.ON_TRIP },
    });

    if (driverClaim.count !== 1) {
      throw new TripDomainError(
        "DRIVER_UNAVAILABLE",
        "Driver is no longer available for dispatch.",
      );
    }

    const tripUpdate = await tx.trip.updateMany({
      where: {
        id: tripId,
        status: TripStatus.DRAFT,
      },
      data: {
        status: TripStatus.DISPATCHED,
        dispatchedAt: new Date(),
      },
    });

    if (tripUpdate.count !== 1) {
      throw new TripDomainError(
        "INVALID_TRIP_STATE",
        "Trip is no longer in draft status.",
      );
    }
  });
}

export async function completeTrip(
  tripId: string,
  input: CompleteTripInput = {},
): Promise<void> {
  const parsed = completeTripInputSchema.parse(input);

  await prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({
      where: { id: tripId },
      include: { vehicle: true, driver: true },
    });

    if (!trip) {
      throw new TripDomainError(
        "TRIP_NOT_FOUND",
        `Trip ${tripId} was not found.`,
      );
    }

    if (trip.status !== TripStatus.DISPATCHED) {
      throw new TripDomainError(
        "INVALID_TRIP_STATE",
        `Only dispatched trips can be completed. Current status: ${trip.status}.`,
      );
    }

    if (
      parsed.finalOdometerKm !== undefined &&
      parsed.finalOdometerKm < trip.vehicle.odometerKm
    ) {
      throw new TripDomainError(
        "INVALID_ODOMETER",
        `Final odometer (${parsed.finalOdometerKm} km) cannot be lower than the vehicle's current odometer (${trip.vehicle.odometerKm} km).`,
      );
    }

    const completedAt = new Date();

    await tx.trip.update({
      where: { id: tripId },
      data: {
        status: TripStatus.COMPLETED,
        completedAt,
        finalOdometerKm: parsed.finalOdometerKm,
      },
    });

    await tx.vehicle.update({
      where: { id: trip.vehicleId },
      data: {
        status: VehicleStatus.AVAILABLE,
        ...(parsed.finalOdometerKm !== undefined
          ? { odometerKm: parsed.finalOdometerKm }
          : {}),
      },
    });

    await tx.driver.update({
      where: { id: trip.driverId },
      data: { status: DriverStatus.AVAILABLE },
    });
  });
}

export async function cancelTrip(tripId: string): Promise<void> {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { id: true, status: true, vehicleId: true, driverId: true },
  });

  if (!trip) {
    throw new TripDomainError("TRIP_NOT_FOUND", `Trip ${tripId} was not found.`);
  }

  if (trip.status === TripStatus.COMPLETED) {
    throw new TripDomainError(
      "INVALID_TRIP_STATE",
      "Completed trips cannot be cancelled.",
    );
  }

  if (trip.status === TripStatus.CANCELLED) {
    throw new TripDomainError(
      "INVALID_TRIP_STATE",
      "Trip is already cancelled.",
    );
  }

  const cancelledAt = new Date();

  if (trip.status === TripStatus.DRAFT) {
    await prisma.trip.update({
      where: { id: tripId },
      data: {
        status: TripStatus.CANCELLED,
        cancelledAt,
      },
    });
    return;
  }

  await prisma.$transaction(async (tx) => {
    const current = await tx.trip.findUnique({
      where: { id: tripId },
      select: { status: true, vehicleId: true, driverId: true },
    });

    if (!current || current.status !== TripStatus.DISPATCHED) {
      throw new TripDomainError(
        "INVALID_TRIP_STATE",
        "Only draft or dispatched trips can be cancelled.",
      );
    }

    await tx.trip.update({
      where: { id: tripId },
      data: {
        status: TripStatus.CANCELLED,
        cancelledAt,
      },
    });

    await tx.vehicle.update({
      where: { id: current.vehicleId },
      data: { status: VehicleStatus.AVAILABLE },
    });

    await tx.driver.update({
      where: { id: current.driverId },
      data: { status: DriverStatus.AVAILABLE },
    });
  });
}
