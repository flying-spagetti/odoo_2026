import { z } from "zod";

export const MAINTENANCE_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

const trimmedNonEmptyString = z.string().trim().min(1);

const paiseSchema = z.number().int().nonnegative();

export const createMaintenanceInputSchema = z.object({
  vehicleId: trimmedNonEmptyString,
  title: trimmedNonEmptyString,
  description: trimmedNonEmptyString,
  priority: z.enum(MAINTENANCE_PRIORITIES),
  estimatedCostPaise: paiseSchema.optional(),
});

export const closeMaintenanceInputSchema = z.object({
  actualCostPaise: paiseSchema.optional(),
});

export const maintenanceIdSchema = trimmedNonEmptyString;

export type CreateMaintenanceInputSchema = z.infer<
  typeof createMaintenanceInputSchema
>;

export type CloseMaintenanceInputSchema = z.infer<
  typeof closeMaintenanceInputSchema
>;
