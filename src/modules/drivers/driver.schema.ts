import { z } from "zod";

export const LICENSE_CATEGORIES = ["LMV", "HMV", "MGV", "HPV"] as const;

const trimmedNonEmptyString = z.string().trim().min(1);

const isoDateSchema = z
  .string()
  .trim()
  .min(1)
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Must be a valid date",
  });

export const createDriverInputSchema = z.object({
  name: trimmedNonEmptyString.max(80),
  licenseNumber: trimmedNonEmptyString.max(64),
  licenseCategory: z.enum(LICENSE_CATEGORIES),
  licenseExpiryDate: isoDateSchema,
  contactNumber: trimmedNonEmptyString.max(32),
  safetyScore: z.number().int().min(0).max(100),
});

export type CreateDriverInputSchema = z.infer<typeof createDriverInputSchema>;
