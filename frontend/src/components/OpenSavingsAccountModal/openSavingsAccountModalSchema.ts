import { z } from "zod";

export const openSavingsAccountSchema = z.object({
  balance: z
    .number({ error: "Initial deposit is required" })
    .min(100000, "Minimum opening deposit is COP 100,000"),
});

export type OpenSavingsAccountFormValues = { balance: number | null };
