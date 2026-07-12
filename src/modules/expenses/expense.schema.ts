import { z } from "zod";

export const EXPENSE_TYPES = ["TOLL", "PARKING", "REPAIR", "OTHER"] as const;

const trimmedNonEmptyString = z.string().trim().min(1);

const optionalTripIdSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value && value.length > 0 ? value : undefined));

const positiveRupeesSchema = z.number().finite().positive();

const isoDateTimeSchema = z
  .string()
  .trim()
  .min(1)
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Must be a valid date/time",
  });

export const createFuelLogInputSchema = z.object({
  vehicleId: trimmedNonEmptyString,
  tripId: optionalTripIdSchema,
  liters: z.number().finite().positive(),
  costRupees: positiveRupeesSchema,
  odometerKm: z.number().int().nonnegative(),
  loggedAt: isoDateTimeSchema,
});

export const createExpenseInputSchema = z.object({
  vehicleId: trimmedNonEmptyString,
  tripId: optionalTripIdSchema,
  type: z.enum(EXPENSE_TYPES),
  description: trimmedNonEmptyString,
  amountRupees: positiveRupeesSchema,
  incurredAt: isoDateTimeSchema,
});

export const expenseVehicleIdSchema = trimmedNonEmptyString;

export type CreateFuelLogInputSchema = z.infer<typeof createFuelLogInputSchema>;
export type CreateExpenseInputSchema = z.infer<typeof createExpenseInputSchema>;
