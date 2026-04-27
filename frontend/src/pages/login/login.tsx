import { Alert, Box, Link, Typography } from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "react-router-dom";
import { FormTextField } from "~/components/FormTextField/formTextField";
import { PrimaryFormButton } from "~/components/PrimaryFormButton/primaryFormButton";
import { useLogin } from "~/hooks/useLogin";
import { parseApiError } from "~/lib/parseApiError";
import * as styles from "./login.sx";

interface LoginFormValues {
    username: string;
    password: string;
}

const defaultValues: LoginFormValues = {
    username: "",
    password: "",
};

export function Login() {
    const loginMutation = useLogin();
    const navigate = useNavigate();
    const form = useForm({
        defaultValues,
        onSubmit: async ({ value }) => {
            loginMutation.mutate(value, {
                onSuccess: () => navigate("/"),
            });
        },
    });

    return (
        <Box sx={styles.pageWrapperSx}>
            <Box
                sx={styles.formCardSx}
                component="form"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <Typography variant="h5" sx={styles.titleSx} data-testid="login-heading">
                    Welcome back
                </Typography>

                {loginMutation.isError && (
                    <Box data-testid="login-error">
                        {parseApiError(loginMutation.error).map((message) => (
                            <Alert key={message} severity="error" sx={styles.errorAlertSx}>
                                {message}
                            </Alert>
                        ))}
                    </Box>
                )}

                <form.Field name="username">
                    {(field) => <FormTextField field={field} label="Username" testId="login-username" />}
                </form.Field>

                <form.Field name="password">
                    {(field) => (
                        <FormTextField field={field} label="Password" type="password" testId="login-password" />
                    )}
                </form.Field>

                <PrimaryFormButton disabled={loginMutation.isPending} testId="login-submit">
                    Sign in
                </PrimaryFormButton>

                <Typography sx={styles.registerLinkSx}>
                    {"Don't have an account? "}
                    <Link href="/register" sx={styles.linkSx} data-testid="login-register-link">
                        Register
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
}
