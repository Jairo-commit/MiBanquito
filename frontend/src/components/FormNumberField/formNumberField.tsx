import { TextField } from "@mui/material";
import { getFieldError } from "~/utils/getFieldError";

interface NumberField {
    state: {
        value: number | undefined;
        meta: { errors: unknown[] };
    };
    handleChange: (value: number) => void;
    handleBlur: () => void;
}

interface FormNumberFieldProps {
    field: NumberField;
    label: string;
    min?: number;
    step?: number;
    testId?: string;
}

export function FormNumberField({ field, label, min, step, testId }: FormNumberFieldProps) {
    const error = getFieldError(field.state.meta.errors);
    return (
        <TextField
            label={label}
            type="number"
            fullWidth
            value={field.state.value ?? ""}
            onChange={(e) => {
                const n = (e.target as HTMLInputElement).valueAsNumber;
                field.handleChange(isNaN(n) ? 0 : n);
            }}
            onBlur={field.handleBlur}
            error={!!error}
            helperText={error}
            slotProps={{
                htmlInput: {
                    min,
                    step,
                    ...(testId ? { "data-testid": testId } : {}),
                },
                formHelperText: testId ? { "data-testid": `${testId}-error` } : {},
            }}
        />
    );
}
