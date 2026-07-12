"use server";

import { Role } from "@/generated/prisma/client";
import {
  getActingUser,
  requireAuthenticatedOperationalUser,
  requireAuthenticatedUser,
} from "@/lib/auth/acting-user";
import { DriverDomainError, toDriverFailure } from "./driver.errors";
import { createDriverInputSchema } from "./driver.schema";
import { createDriver, listDrivers } from "./driver.service";
import type {
  CreateDriverInput,
  DriverActionResult,
  DriverListItem,
} from "./driver.types";

const DRIVER_MUTATION_ROLES: Role[] = [
  Role.FLEET_MANAGER,
  Role.SAFETY_OFFICER,
];

async function runDriverAction<T>(
  action: () => Promise<T>,
): Promise<DriverActionResult<T>> {
  try {
    const data = await action();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: toDriverFailure(error) };
  }
}

export async function listDriversAction(): Promise<
  DriverActionResult<DriverListItem[]>
> {
  return runDriverAction(async () => {
    await requireAuthenticatedOperationalUser();
    return listDrivers();
  });
}

export async function canMutateDriversAction(): Promise<boolean> {
  const user = await getActingUser();
  return (
    user !== null && DRIVER_MUTATION_ROLES.includes(user.role)
  );
}

export async function createDriverAction(
  input: CreateDriverInput,
): Promise<DriverActionResult<DriverListItem>> {
  return runDriverAction(async () => {
    const user = await requireAuthenticatedUser();

    if (!DRIVER_MUTATION_ROLES.includes(user.role)) {
      throw new DriverDomainError(
        "FORBIDDEN",
        "You do not have permission to manage drivers.",
      );
    }

    const parsed = createDriverInputSchema.safeParse(input);

    if (!parsed.success) {
      throw parsed.error;
    }

    return createDriver(parsed.data);
  });
}
