import { z } from "zod";

export const openCdtSchema = z.object({
  amount: z
    .string()
    .min(1, "Investment amount is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Please enter a valid amount"
    ),
  term_days: z
    .string()
    .min(1, "Term in days is required")
    .refine(
      (val) => Number.isInteger(Number(val)) && Number(val) >= 30,
      "Minimum term is 30 days"
    ),
  annual_rate: z
    .string()
    .min(1, "Annual interest rate is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) < 100,
      "Enter a rate between 0 and 100"
    ),
  maturity_date: z
    .string()
    .min(1, "Maturity date is required")
    .refine(
      (val) => !isNaN(Date.parse(val)),
      "Please enter a valid date"
    )
    .refine(
      (val) => new Date(val) > new Date(),
      "Maturity date must be in the future"
    ),
});

export type OpenCdtFormValues = z.infer<typeof openCdtSchema>;
