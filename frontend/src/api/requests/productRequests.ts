import api from "~/api/api";
import type { LoanRequest } from "~/models/loanRequest.model";
import type { CDT } from "~/models/cdt.model";

export type CreateLoanPayload = {
  amount: string;
  term_months: number;
  monthly_rate: string;
};

export type CreateCdtPayload = {
  amount: string;
  term_days: number;
  annual_rate: string;
  maturity_date: string;
};

export const createLoanRequest = (payload: CreateLoanPayload): Promise<LoanRequest> =>
  api.post("products/loans/", payload).then((res) => res.data);

export const createCdt = (payload: CreateCdtPayload): Promise<CDT> =>
  api.post("products/cdts/", payload).then((res) => res.data);
