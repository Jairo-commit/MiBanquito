import * as Factory from "factory.ts";
import type { SavingsAccount } from "~/models/account.model";

export const accountFactory = Factory.Sync.makeFactory<SavingsAccount>({
    id: Factory.each((i: number) => i + 1),
    user: 1,
    account_number: Factory.each((i: number) => `MB-${String(i + 1).padStart(4, "0")}-2025`),
    balance: "1000000.00",
    is_active: true,
    created_at: Factory.each((i: number) => new Date(2025, 0, i + 1).toISOString()),
});
