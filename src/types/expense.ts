export interface FuelLog {
  id: string;
  vehicleName: string;
  date: string;
  litres: number;
  fuelCost: number;
}

export interface TripExpense {
  id: string;
  tripCode: string;
  vehicleName: string;
  toll: number;
  other: number;
  maintenanceLinked: number;
  status: "AVAILABLE" | "COMPLETED";
}

export interface ExpenseSummary {
  totalFuelCost: number;
  totalMaintenanceCost: number;
  totalOperationalCost: number;
}
