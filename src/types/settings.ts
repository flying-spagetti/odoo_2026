export type PermissionLevel = "full" | "view" | "none";

export type RbacModule = "fleet" | "drivers" | "trips" | "fuelExpenses" | "analytics";

export interface GeneralSettings {
  depotName: string;
  currency: string;
  distanceUnit: string;
}

export interface RolePermissionRow {
  roleLabel: string;
  permissions: Record<RbacModule, PermissionLevel>;
}

export interface SettingsData {
  general: GeneralSettings;
  rolePermissions: RolePermissionRow[];
}

export const CURRENCY_OPTIONS = [
  { value: "INR", label: "INR (Rs)" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
] as const;

export const DISTANCE_UNIT_OPTIONS = [
  { value: "KILOMETERS", label: "Kilometers" },
  { value: "MILES", label: "Miles" },
] as const;

export const RBAC_MODULE_LABELS: Record<RbacModule, string> = {
  fleet: "Fleet",
  drivers: "Drivers",
  trips: "Trips",
  fuelExpenses: "Fuel/Exp.",
  analytics: "Analytics",
};

export const RBAC_MODULES: RbacModule[] = [
  "fleet",
  "drivers",
  "trips",
  "fuelExpenses",
  "analytics",
];
