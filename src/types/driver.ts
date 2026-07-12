import type { DriverStatus } from "./status";

export interface Driver {
  id: string;
  name: string;
  licenceNumber: string;
  licenceCategory: string;
  licenceExpiry: string;
  safetyScore: number;
  status: DriverStatus;
}
