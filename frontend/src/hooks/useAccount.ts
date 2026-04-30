import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "~/api/requests/accountRequests";

export const useAccount = () =>
  useQuery({ queryKey: ["accounts"], queryFn: getAccounts });
