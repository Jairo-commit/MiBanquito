import { z } from "zod";

export const openSavingsAccountSchema = z.object({
  balance: z
    .number({ error: "Please enter a valid amount" })
    .min(100000, "Minimum opening deposit is COP 100,000"),
});

export type OpenSavingsAccountFormValues = z.infer<typeof openSavingsAccountSchema>;
