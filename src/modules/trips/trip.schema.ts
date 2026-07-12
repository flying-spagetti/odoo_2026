import { z } from "zod";

export const completeTripInputSchema = z.object({
  finalOdometerKm: z.number().int().nonnegative().optional(),
});

export type CompleteTripInputSchema = z.infer<typeof completeTripInputSchema>;
