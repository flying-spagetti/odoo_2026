export type DashboardKpis = {
  activeVehicles: number;
  availableVehicles: number;
  vehiclesInMaintenance: number;
  retiredVehicles: number;
  totalVehicles: number;
  activeTrips: number;
  pendingTrips: number;
  driversOnDuty: number;
  fleetUtilization: number;
};

export type FleetActivityItem = {
  id: string;
  type: "trip" | "maintenance" | "dispatch";
  description: string;
  timestamp: string;
  status: string;
};

export type DashboardOverview = {
  kpis: DashboardKpis;
  recentActivity: FleetActivityItem[];
};
