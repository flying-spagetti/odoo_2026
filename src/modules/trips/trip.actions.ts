"use server";

import { Role } from "@/generated/prisma/client";
import {
  getActingUser,
  requireAuthenticatedOperationalUser,
  requireTripMutationRole,
} from "@/lib/auth/acting-user";
import { toTripFailure } from "./trip.errors";
import {
  completeTripInputSchema,
  createTripInputSchema,
} from "./trip.schema";
import {
  cancelTrip,
  completeTrip,
  createTrip,
  dispatchTrip,
  getDispatchReadiness,
  getTripDetail,
  listEligibleDriversForTrip,
  listEligibleVehiclesForTrip,
  listLiveBoardTrips,
} from "./trip.service";
import type {
  CompleteTripInput,
  CreateTripInput,
  DispatchReadiness,
  TripActionResult,
  TripBoardItem,
  TripDetailView,
  TripDriverOption,
  TripVehicleOption,
} from "./trip.types";

async function runTripAction<T>(
  action: () => Promise<T>,
): Promise<TripActionResult<T>> {
  try {
    const data = await action();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: toTripFailure(error) };
  }
}

export async function listLiveBoardTripsAction(): Promise<
  TripActionResult<TripBoardItem[]>
> {
  return runTripAction(async () => {
    await requireAuthenticatedOperationalUser();
    return listLiveBoardTrips();
  });
}

export async function getTripDetailAction(
  tripId: string,
): Promise<TripActionResult<TripDetailView>> {
  return runTripAction(async () => {
    await requireAuthenticatedOperationalUser();
    return getTripDetail(tripId);
  });
}

export async function listEligibleVehiclesForTripAction(): Promise<
  TripActionResult<TripVehicleOption[]>
> {
  return runTripAction(async () => {
    await requireAuthenticatedOperationalUser();
    return listEligibleVehiclesForTrip();
  });
}

export async function listEligibleDriversForTripAction(): Promise<
  TripActionResult<TripDriverOption[]>
> {
  return runTripAction(async () => {
    await requireAuthenticatedOperationalUser();
    return listEligibleDriversForTrip();
  });
}

export async function canMutateTripsAction(): Promise<boolean> {
  const user = await getActingUser();
  return (
    user !== null &&
    (user.role === Role.FLEET_MANAGER || user.role === Role.DISPATCHER)
  );
}

export async function getDispatchReadinessAction(
  tripId: string,
): Promise<TripActionResult<DispatchReadiness>> {
  return runTripAction(async () => {
    await requireAuthenticatedOperationalUser();
    return getDispatchReadiness(tripId);
  });
}

export async function createTripAction(
  input: CreateTripInput,
): Promise<TripActionResult<TripDetailView>> {
  return runTripAction(async () => {
    await requireTripMutationRole();

    const parsed = createTripInputSchema.safeParse(input);

    if (!parsed.success) {
      throw parsed.error;
    }

    return createTrip(parsed.data);
  });
}

export async function dispatchTripAction(
  tripId: string,
): Promise<TripActionResult<void>> {
  return runTripAction(async () => {
    await requireTripMutationRole();
    await dispatchTrip(tripId);
  });
}

export async function completeTripAction(
  tripId: string,
  input: CompleteTripInput = {},
): Promise<TripActionResult<void>> {
  return runTripAction(async () => {
    await requireTripMutationRole();

    const parsed = completeTripInputSchema.safeParse(input);

    if (!parsed.success) {
      throw parsed.error;
    }

    await completeTrip(tripId, parsed.data);
  });
}

export async function cancelTripAction(
  tripId: string,
): Promise<TripActionResult<void>> {
  return runTripAction(async () => {
    await requireTripMutationRole();
    await cancelTrip(tripId);
  });
}
