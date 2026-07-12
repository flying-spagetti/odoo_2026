import type { SettingsData } from "@/types/settings";

/**
 * Application defaults — there is no org-settings table yet.
 * Display-only until persistence is added.
 */
export const APP_SETTINGS_DEFAULTS: SettingsData["general"] = {
  depotName: "TransitOps Depot",
  currency: "INR",
  distanceUnit: "KILOMETERS",
};

/**
 * Mirrors real mutation gates in acting-user + module actions.
 * Operational pages are viewable by all authenticated operational roles.
 */
export const ROLE_PERMISSION_MATRIX: SettingsData["rolePermissions"] = [
  {
    roleLabel: "Fleet Manager",
    permissions: {
      fleet: "full",
      drivers: "full",
      trips: "full",
      fuelExpenses: "full",
      analytics: "view",
    },
  },
  {
    roleLabel: "Dispatcher",
    permissions: {
      fleet: "view",
      drivers: "view",
      trips: "full",
      fuelExpenses: "view",
      analytics: "view",
    },
  },
  {
    roleLabel: "Safety Officer",
    permissions: {
      fleet: "view",
      drivers: "full",
      trips: "view",
      fuelExpenses: "view",
      analytics: "view",
    },
  },
  {
    roleLabel: "Financial Analyst",
    permissions: {
      fleet: "view",
      drivers: "view",
      trips: "view",
      fuelExpenses: "full",
      analytics: "view",
    },
  },
];
