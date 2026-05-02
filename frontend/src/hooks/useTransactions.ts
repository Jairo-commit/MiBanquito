import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "~/api/requests/transactionRequests";

export const useTransactions = () =>
  useQuery({ queryKey: ["transactions"], queryFn: getTransactions });
