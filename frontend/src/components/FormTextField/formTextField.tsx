import { TextField } from "@mui/material";
import { getFieldError } from "~/utils/getFieldError";

interface StringField {
    state: {
        value: string | undefined;
        meta: { errors: unknown[] };
    };
    handleChange: (value: string) => void;
    handleBlur: () => void;
}

interface FormTextFieldProps {
    field: StringField;
    label: string;
    type?: string;
    testId?: string;
}

export function FormTextField({ field, label, type = "text", testId }: FormTextFieldProps) {
    const error = getFieldError(field.state.meta.errors);
    return (
        <TextField
            label={label}
            type={type}
            fullWidth
            value={field.state.value ?? ""}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            error={!!error}
            helperText={error}
            slotProps={{
                htmlInput: testId ? { "data-testid": testId } : {},
                formHelperText: testId ? { "data-testid": `${testId}-error` } : {},
            }}
        />
    );
}
