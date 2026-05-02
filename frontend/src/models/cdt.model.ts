export type CDT = {
  id: string;
  user: number;
  amount: string;
  term_days: number;
  annual_rate: string;
  maturity_date: string;
  status: "ACTIVE" | "MATURED";
  created_at: string;
};
