import type { ServiceLog } from "@/types/maintenance";

export const MOCK_SERVICE_LOGS: ServiceLog[] = [
  {
    id: "m1",
    vehicleName: "VAN-05",
    serviceType: "Oil Change",
    cost: 2500,
    date: "2026-07-07",
    status: "IN_SHOP",
  },
  {
    id: "m2",
    vehicleName: "TRUCK-11",
    serviceType: "Engine Repair",
    cost: 18000,
    date: "2026-07-05",
    status: "COMPLETED",
  },
  {
    id: "m3",
    vehicleName: "MINI-03",
    serviceType: "Tyre Replace",
    cost: 6200,
    date: "2026-07-03",
    status: "IN_SHOP",
  },
];

export const MOCK_MAINTENANCE_VEHICLES = [
  "VAN-05",
  "TRUCK-11",
  "MINI-03",
  "VAN-09",
] as const;
