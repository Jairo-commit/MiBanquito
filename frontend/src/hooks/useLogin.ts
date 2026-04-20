import { useMutation } from "@tanstack/react-query";
import { postLogin } from "~/api/requests/authRequests";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "~/constants/tokenConstants";

export const useLogin = () =>
    useMutation({
        mutationFn: postLogin,
        onSuccess: (data) => {
            localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
            localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);
        },
    });
