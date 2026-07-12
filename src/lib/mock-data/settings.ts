import type { SettingsData } from "@/types/settings";

export const MOCK_SETTINGS: SettingsData = {
  general: {
    depotName: "Gandhinagar Depot GJ14",
    currency: "INR",
    distanceUnit: "KILOMETERS",
  },
  rolePermissions: [
    {
      roleLabel: "Fleet Manager",
      permissions: {
        fleet: "full",
        drivers: "full",
        trips: "none",
        fuelExpenses: "none",
        analytics: "full",
      },
    },
    {
      roleLabel: "Dispatcher",
      permissions: {
        fleet: "view",
        drivers: "none",
        trips: "full",
        fuelExpenses: "none",
        analytics: "none",
      },
    },
    {
      roleLabel: "Safety Officer",
      permissions: {
        fleet: "none",
        drivers: "full",
        trips: "view",
        fuelExpenses: "none",
        analytics: "none",
      },
    },
    {
      roleLabel: "Financial Analyst",
      permissions: {
        fleet: "view",
        drivers: "none",
        trips: "none",
        fuelExpenses: "full",
        analytics: "full",
      },
    },
  ],
};
