export interface DashboardKpis {
  activeVehicles: number;
  availableVehicles: number;
  vehiclesInMaintenance: number;
  activeTrips: number;
  pendingTrips: number;
  driversOnDuty: number;
  fleetUtilization: number;
}

export interface FleetActivityItem {
  id: string;
  type: "trip" | "maintenance" | "dispatch";
  description: string;
  timestamp: string;
  status: string;
}

export const MOCK_DASHBOARD_KPIS: DashboardKpis = {
  activeVehicles: 18,
  availableVehicles: 24,
  vehiclesInMaintenance: 3,
  activeTrips: 12,
  pendingTrips: 5,
  driversOnDuty: 16,
  fleetUtilization: 72,
};

export const MOCK_FLEET_ACTIVITY: FleetActivityItem[] = [
  {
    id: "1",
    type: "dispatch",
    description: "Trip TRP-1042 dispatched — MH-12-AB-4521",
    timestamp: "2026-07-12T08:15:00",
    status: "DISPATCHED",
  },
  {
    id: "2",
    type: "trip",
    description: "Trip TRP-1038 completed — DL-01-CD-8834",
    timestamp: "2026-07-12T07:42:00",
    status: "COMPLETED",
  },
  {
    id: "3",
    type: "maintenance",
    description: "Vehicle KA-05-EF-2210 moved to maintenance",
    timestamp: "2026-07-12T06:30:00",
    status: "IN_SHOP",
  },
  {
    id: "4",
    type: "dispatch",
    description: "Trip TRP-1045 pending dispatch validation",
    timestamp: "2026-07-12T05:55:00",
    status: "DRAFT",
  },
  {
    id: "5",
    type: "trip",
    description: "Driver Ravi Kumar assigned to TRP-1042",
    timestamp: "2026-07-12T05:10:00",
    status: "ON_TRIP",
  },
];
