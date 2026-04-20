import { useMutation } from "@tanstack/react-query";
import { postRegister } from "~/api/requests/authRequests";

export const useRegister = () => useMutation({ mutationFn: postRegister });
