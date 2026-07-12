"use server";

import { Role } from "@/generated/prisma/client";
import {
  getActingUser,
  requireAuthenticatedOperationalUser,
  requireFleetManagerRole,
} from "@/lib/auth/acting-user";
import { toVehicleFailure } from "./vehicle.errors";
import { createVehicleInputSchema } from "./vehicle.schema";
import { createVehicle, listVehicles } from "./vehicle.service";
import type {
  CreateVehicleInput,
  VehicleActionResult,
  VehicleListItem,
} from "./vehicle.types";

async function runVehicleAction<T>(
  action: () => Promise<T>,
): Promise<VehicleActionResult<T>> {
  try {
    const data = await action();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: toVehicleFailure(error) };
  }
}

export async function listVehiclesAction(): Promise<
  VehicleActionResult<VehicleListItem[]>
> {
  return runVehicleAction(async () => {
    await requireAuthenticatedOperationalUser();
    return listVehicles();
  });
}

export async function canMutateVehiclesAction(): Promise<boolean> {
  const user = await getActingUser();
  return user !== null && user.role === Role.FLEET_MANAGER;
}

export async function createVehicleAction(
  input: CreateVehicleInput,
): Promise<VehicleActionResult<VehicleListItem>> {
  return runVehicleAction(async () => {
    await requireFleetManagerRole();
    const parsed = createVehicleInputSchema.safeParse(input);

    if (!parsed.success) {
      throw parsed.error;
    }

    return createVehicle(parsed.data);
  });
}
