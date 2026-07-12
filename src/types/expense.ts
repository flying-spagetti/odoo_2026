export interface FuelLog {
  id: string;
  date: string;
  vehicleRegistration: string;
  litres: number;
  cost: number;
  odometerKm: number;
}

export interface OperationalExpense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
}

export interface ExpenseSummary {
  totalFuelCost: number;
  totalMaintenanceCost: number;
  totalOperationalCost: number;
  totalOtherCost: number;
}
