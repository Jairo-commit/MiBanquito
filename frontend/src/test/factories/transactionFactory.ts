import * as Factory from "factory.ts";
import type { Transaction } from "~/models/transaction.model";

export const transactionFactory = Factory.Sync.makeFactory<Transaction>({
    id: Factory.each((i: number) => `tx-uuid-${i + 1}`),
    source_account: 1,
    destination_account: 2,
    source_account_number: Factory.each((i: number) => `MB-SRC-${String(i + 1).padStart(4, "0")}-2025`),
    source_account_holder: "John Doe",
    destination_account_number: Factory.each((i: number) => `MB-DST-${String(i + 1).padStart(4, "0")}-2025`),
    destination_account_holder: "Jane Smith",
    transaction_type: "INTERNAL",
    amount: "500000.00",
    status: "COMPLETED",
    reference: Factory.each((i: number) => `ref-uuid-${i + 1}`),
    created_at: Factory.each((i: number) => new Date(2025, 0, i + 1).toISOString()),
    description: "",
});
