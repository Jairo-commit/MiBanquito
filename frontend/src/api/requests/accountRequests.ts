import api from "~/api/api";
import type { SavingsAccount } from "~/models/account.model";

export const getAccounts = (): Promise<SavingsAccount[]> =>
  api.get("accounts/").then((res) => res.data.results ?? res.data);
