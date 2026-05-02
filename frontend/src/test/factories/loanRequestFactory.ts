import * as Factory from "factory.ts";
import type { LoanRequest } from "~/models/loanRequest.model";

export const loanRequestFactory = Factory.Sync.makeFactory<LoanRequest>({
  id: Factory.each((i: number) => `loan-uuid-${i + 1}`),
  user: 1,
  amount: "5000000.00",
  term_months: 24,
  monthly_rate: "0.0150",
  status: "PENDING",
  created_at: Factory.each((i: number) => new Date(2025, 0, i + 1).toISOString()),
  reviewed_by: null,
  reviewed_at: null,
});
