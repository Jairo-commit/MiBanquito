import { useMutation } from "@tanstack/react-query";
import { createLoanRequest } from "~/api/requests/productRequests";

export const useCreateLoan = () =>
  useMutation({ mutationFn: createLoanRequest });
