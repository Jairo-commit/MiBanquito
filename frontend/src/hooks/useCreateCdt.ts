import { useMutation } from "@tanstack/react-query";
import { createCdt } from "~/api/requests/productRequests";

export const useCreateCdt = () =>
  useMutation({ mutationFn: createCdt });
