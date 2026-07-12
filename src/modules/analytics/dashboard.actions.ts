"use server";

import { requireAuthenticatedOperationalUser } from "@/lib/auth/acting-user";
import { getDashboardOverview } from "./dashboard.service";
import type { DashboardOverview } from "./dashboard.types";

export type DashboardActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string } };

export async function getDashboardOverviewAction(): Promise<
  DashboardActionResult<DashboardOverview>
> {
  try {
    await requireAuthenticatedOperationalUser();
    const data = await getDashboardOverview();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error
            ? error.message
            : "Unable to load dashboard overview.",
      },
    };
  }
}
