import api from "~/api/api";
import type { Transaction } from "~/models/transaction.model";

export const getTransactions = (): Promise<Transaction[]> =>
  api.get("transactions/").then((res) => res.data.results ?? res.data);

export type TransferPayload = {
  source_account: number;
  to_account_number: string;
  transaction_type: "INTERNAL";
  amount: string;
  description: string;
};

export const createTransfer = (data: TransferPayload): Promise<Transaction> =>
  api.post("transactions/", data).then((res) => res.data);
