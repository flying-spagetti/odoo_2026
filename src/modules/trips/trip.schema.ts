import { z } from "zod";

const trimmedNonEmptyString = z.string().trim().min(1);

export const completeTripInputSchema = z.object({
  finalOdometerKm: z.number().int().nonnegative().optional(),
});

export const createTripInputSchema = z.object({
  source: trimmedNonEmptyString,
  destination: trimmedNonEmptyString,
  cargoWeightKg: z.number().int().positive(),
  plannedDistanceKm: z.number().int().positive(),
  vehicleId: trimmedNonEmptyString,
  driverId: trimmedNonEmptyString,
});

export type CompleteTripInputSchema = z.infer<typeof completeTripInputSchema>;
export type CreateTripInputSchema = z.infer<typeof createTripInputSchema>;
