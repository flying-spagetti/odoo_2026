import type { AnalyticsOverview } from "@/types/analytics";

export const MOCK_ANALYTICS_OVERVIEW: AnalyticsOverview = {
  kpis: [
    {
      label: "Fuel Efficiency",
      value: "8.4 km/l",
      accentColor: "blue",
    },
    {
      label: "Fleet Utilization",
      value: "81%",
      accentColor: "green",
    },
    {
      label: "Operational Cost",
      value: "34,070",
      accentColor: "orange",
    },
    {
      label: "Vehicle ROI",
      value: "14.2%",
      accentColor: "green",
    },
  ],
  roiFormula:
    "ROI = (Revenue - (Maintenance + Fuel)) / Acquisition Cost",
  monthlyRevenue: [
    { month: "Jan", revenue: 42000 },
    { month: "Feb", revenue: 38000 },
    { month: "Mar", revenue: 51000 },
    { month: "Apr", revenue: 47000 },
    { month: "May", revenue: 55000 },
    { month: "Jun", revenue: 49000 },
    { month: "Jul", revenue: 58000 },
  ],
  costliestVehicles: [
    { vehicleName: "TRUCK-11", cost: 24500, accentColor: "red" },
    { vehicleName: "MINI-03", cost: 14200, accentColor: "orange" },
    { vehicleName: "VAN-05", cost: 8600, accentColor: "blue" },
  ],
};
