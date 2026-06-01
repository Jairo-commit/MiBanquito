import type { Transaction } from "~/models/transaction.model";

export const getTransactionParties = (
  tx: Transaction,
  isSuperuser: boolean
): { source: string; destination: string } => ({
  source: (isSuperuser ? tx.source_account_holder : tx.source_account_number) ?? "—",
  destination:
    (isSuperuser ? tx.destination_account_holder : tx.destination_account_number) ?? "—",
});

export const formatAmount = (amount: string): string =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(amount));

export const formatDate = (dateStr: string): string =>
  new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateStr));
