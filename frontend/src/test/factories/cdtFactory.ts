import * as Factory from "factory.ts";
import type { CDT } from "~/models/cdt.model";

export const cdtFactory = Factory.Sync.makeFactory<CDT>({
  id: Factory.each((i: number) => `cdt-uuid-${i + 1}`),
  user: 1,
  amount: "2000000.00",
  term_days: 180,
  annual_rate: "0.0800",
  maturity_date: "2026-07-01",
  status: "ACTIVE",
  created_at: Factory.each((i: number) => new Date(2025, 0, i + 1).toISOString()),
});
