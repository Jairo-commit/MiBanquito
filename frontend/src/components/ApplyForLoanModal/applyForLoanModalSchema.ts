import { z } from "zod";

export const applyForLoanSchema = z.object({
  amount: z
    .string()
    .min(1, "Loan amount is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Please enter a valid amount"
    ),
  term_months: z
    .string()
    .min(1, "Loan term is required")
    .refine(
      (val) => Number.isInteger(Number(val)) && Number(val) >= 1 && Number(val) <= 360,
      "Term must be between 1 and 360 months"
    ),
  monthly_rate: z
    .string()
    .min(1, "Monthly interest rate is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) < 100,
      "Enter a rate between 0 and 100"
    ),
});

export type ApplyForLoanFormValues = z.infer<typeof applyForLoanSchema>;
