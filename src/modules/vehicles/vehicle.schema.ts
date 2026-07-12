import { z } from "zod";

export const VEHICLE_TYPES = ["TRUCK", "VAN", "BUS", "TRAILER"] as const;

const trimmedNonEmptyString = z.string().trim().min(1);

export const createVehicleInputSchema = z.object({
  registrationNumber: trimmedNonEmptyString.max(32),
  name: trimmedNonEmptyString.max(80),
  model: trimmedNonEmptyString.max(80),
  type: z.enum(VEHICLE_TYPES),
  maxLoadKg: z.number().int().positive(),
  odometerKm: z.number().int().nonnegative(),
  acquisitionCostRupees: z.number().finite().positive(),
  region: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined)),
});

export type CreateVehicleInputSchema = z.infer<typeof createVehicleInputSchema>;
