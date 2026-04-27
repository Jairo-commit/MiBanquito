import { useQuery } from "@tanstack/react-query";
import { getMe } from "~/api/requests/authRequests";

export const useCurrentUser = () =>
  useQuery({ queryKey: ["currentUser"], queryFn: getMe });
