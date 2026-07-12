export const VEHICLE_STATUSES = [
  "AVAILABLE",
  "ON_TRIP",
  "IN_SHOP",
  "RETIRED",
] as const;

export const DRIVER_STATUSES = [
  "AVAILABLE",
  "ON_TRIP",
  "OFF_DUTY",
  "SUSPENDED",
] as const;

export const TRIP_STATUSES = [
  "DRAFT",
  "DISPATCHED",
  "COMPLETED",
  "CANCELLED",
] as const;

export const MAINTENANCE_STATUSES = [
  "OPEN",
  "IN_PROGRESS",
  "CLOSED",
  "CANCELLED",
] as const;

export type VehicleStatus = (typeof VEHICLE_STATUSES)[number];
export type DriverStatus = (typeof DRIVER_STATUSES)[number];
export type TripStatus = (typeof TRIP_STATUSES)[number];
export type MaintenanceStatus = (typeof MAINTENANCE_STATUSES)[number];
export type OperationalStatus =
  | VehicleStatus
  | DriverStatus
  | TripStatus
  | MaintenanceStatus;

export type StatusColorPalette = "green" | "blue" | "orange" | "red" | "gray";

export interface StatusConfig {
  label: string;
  colorPalette: StatusColorPalette;
}

export const STATUS_CONFIG: Record<string, StatusConfig> = {
  AVAILABLE: { label: "Available", colorPalette: "green" },
  ON_TRIP: { label: "On Trip", colorPalette: "blue" },
  IN_SHOP: { label: "In Shop", colorPalette: "orange" },
  RETIRED: { label: "Retired", colorPalette: "gray" },
  OFF_DUTY: { label: "Off Duty", colorPalette: "gray" },
  SUSPENDED: { label: "Suspended", colorPalette: "red" },
  DRAFT: { label: "Draft", colorPalette: "gray" },
  DISPATCHED: { label: "Dispatched", colorPalette: "blue" },
  COMPLETED: { label: "Completed", colorPalette: "green" },
  CANCELLED: { label: "Cancelled", colorPalette: "red" },
  OPEN: { label: "Open", colorPalette: "blue" },
  IN_PROGRESS: { label: "In Progress", colorPalette: "orange" },
  CLOSED: { label: "Closed", colorPalette: "green" },
  LOW: { label: "Low", colorPalette: "gray" },
  MEDIUM: { label: "Medium", colorPalette: "blue" },
  HIGH: { label: "High", colorPalette: "orange" },
  CRITICAL: { label: "Critical", colorPalette: "red" },
};

export function getStatusConfig(status: string): StatusConfig {
  return (
    STATUS_CONFIG[status] ?? {
      label: status.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase()),
      colorPalette: "gray",
    }
  );
}
