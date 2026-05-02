export type LoanRequest = {
  id: string;
  user: number;
  amount: string;
  term_months: number;
  monthly_rate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  created_at: string;
  reviewed_by: number | null;
  reviewed_at: string | null;
};
