"use server";

import { requireAuthenticatedOperationalUser } from "@/lib/auth/acting-user";
import type { AnalyticsOverview } from "@/types/analytics";
import { getAnalyticsOverview } from "./analytics.service";

export type AnalyticsActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string } };

export async function getAnalyticsOverviewAction(): Promise<
  AnalyticsActionResult<AnalyticsOverview>
> {
  try {
    await requireAuthenticatedOperationalUser();
    const data = await getAnalyticsOverview();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error
            ? error.message
            : "Unable to load analytics overview.",
      },
    };
  }
}
