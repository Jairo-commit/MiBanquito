import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransfer } from "~/api/requests/transactionRequests";

export const useTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};
