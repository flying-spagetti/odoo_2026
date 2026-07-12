export type AnalyticsAccentColor = "blue" | "green" | "orange";

export interface AnalyticsKpi {
  label: string;
  value: string;
  accentColor: AnalyticsAccentColor;
}

export interface MonthlyRevenuePoint {
  month: string;
  revenue: number;
}

export interface CostliestVehicle {
  vehicleName: string;
  cost: number;
  accentColor: AnalyticsAccentColor | "red";
}

export interface AnalyticsOverview {
  kpis: AnalyticsKpi[];
  roiFormula: string;
  monthlyRevenue: MonthlyRevenuePoint[];
  costliestVehicles: CostliestVehicle[];
}
