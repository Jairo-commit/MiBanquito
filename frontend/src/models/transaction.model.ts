export type Transaction = {
  id: string;
  source_account: number | null;
  destination_account: number | null;
  source_account_number: string | null;
  source_account_holder: string | null;
  destination_account_number: string | null;
  destination_account_holder: string | null;
  transaction_type: "INTERNAL" | "EXTERNAL";
  amount: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  reference: string;
  created_at: string;
  description: string;
};
