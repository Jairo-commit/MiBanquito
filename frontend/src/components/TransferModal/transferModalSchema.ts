import { z } from "zod";

export const transferSchema = z.object({
  to_account_number: z.string().min(1, "Destination account number is required"),
  amount: z
    .number({ error: "Please enter a valid amount" })
    .int("Amount must be a whole number")
    .min(1, "Minimum transfer amount is COP 1"),
  description: z.string(),
});

export type TransferFormValues = z.infer<typeof transferSchema>;
