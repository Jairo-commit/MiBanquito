import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAccount } from "~/api/requests/accountRequests";

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};
