export type ServiceLogStatus = "IN_SHOP" | "COMPLETED";

export interface ServiceLog {
  id: string;
  vehicleName: string;
  serviceType: string;
  cost: number;
  date: string;
  status: ServiceLogStatus;
}

export interface ServiceLogFormValues {
  vehicleName: string;
  serviceType: string;
  cost: string;
  date: string;
  status: "ACTIVE" | "COMPLETE";
}

export const SERVICE_LOG_STATUS_LABELS: Record<ServiceLogStatus, string> = {
  IN_SHOP: "In Shop",
  COMPLETED: "Completed",
};

export const SERVICE_FORM_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETE", label: "Complete" },
] as const;
