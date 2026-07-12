"use server";

import { Role } from "@/generated/prisma/client";
import {
  getActingUser,
  requireAuthenticatedOperationalUser,
  requireFleetManagerRole,
} from "@/lib/auth/acting-user";
import { toMaintenanceFailure } from "./maintenance.errors";
import {
  closeMaintenanceInputSchema,
  createMaintenanceInputSchema,
  maintenanceIdSchema,
} from "./maintenance.schema";
import {
  closeMaintenance,
  createMaintenanceRecord,
  getMaintenanceDetail,
  listEligibleVehiclesForMaintenance,
  listMaintenanceRecords,
  startMaintenance,
} from "./maintenance.service";
import type {
  CloseMaintenanceInput,
  CreateMaintenanceInput,
  EligibleVehicleOption,
  MaintenanceActionResult,
  MaintenanceDetailView,
  MaintenanceListItem,
} from "./maintenance.types";

async function runMaintenanceAction<T>(
  action: () => Promise<T>,
): Promise<MaintenanceActionResult<T>> {
  try {
    const data = await action();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: toMaintenanceFailure(error) };
  }
}

export async function listMaintenanceRecordsAction(): Promise<
  MaintenanceActionResult<MaintenanceListItem[]>
> {
  return runMaintenanceAction(async () => {
    await requireAuthenticatedOperationalUser();
    return listMaintenanceRecords();
  });
}

export async function getMaintenanceDetailAction(
  recordId: string,
): Promise<MaintenanceActionResult<MaintenanceDetailView>> {
  return runMaintenanceAction(async () => {
    await requireAuthenticatedOperationalUser();
    const parsedId = maintenanceIdSchema.safeParse(recordId);

    if (!parsedId.success) {
      throw parsedId.error;
    }

    return getMaintenanceDetail(parsedId.data);
  });
}

export async function listEligibleVehiclesForMaintenanceAction(): Promise<
  MaintenanceActionResult<EligibleVehicleOption[]>
> {
  return runMaintenanceAction(async () => {
    await requireAuthenticatedOperationalUser();
    return listEligibleVehiclesForMaintenance();
  });
}

export async function canMutateMaintenanceAction(): Promise<boolean> {
  const user = await getActingUser();
  return user !== null && user.role === Role.FLEET_MANAGER;
}

export async function createMaintenanceRecordAction(
  input: CreateMaintenanceInput,
): Promise<MaintenanceActionResult<MaintenanceDetailView>> {
  return runMaintenanceAction(async () => {
    await requireFleetManagerRole();

    const parsed = createMaintenanceInputSchema.safeParse(input);

    if (!parsed.success) {
      throw parsed.error;
    }

    return createMaintenanceRecord(parsed.data);
  });
}

export async function startMaintenanceAction(
  recordId: string,
): Promise<MaintenanceActionResult<MaintenanceDetailView>> {
  return runMaintenanceAction(async () => {
    await requireFleetManagerRole();

    const parsedId = maintenanceIdSchema.safeParse(recordId);

    if (!parsedId.success) {
      throw parsedId.error;
    }

    return startMaintenance(parsedId.data);
  });
}

export async function closeMaintenanceAction(
  recordId: string,
  input: CloseMaintenanceInput = {},
): Promise<MaintenanceActionResult<MaintenanceDetailView>> {
  return runMaintenanceAction(async () => {
    await requireFleetManagerRole();

    const parsedId = maintenanceIdSchema.safeParse(recordId);

    if (!parsedId.success) {
      throw parsedId.error;
    }

    const parsedInput = closeMaintenanceInputSchema.safeParse(input);

    if (!parsedInput.success) {
      throw parsedInput.error;
    }

    return closeMaintenance(parsedId.data, parsedInput.data);
  });
}
