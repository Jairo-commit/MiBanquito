import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { getFieldError } from "~/utils/getFieldError";

interface SelectField<TValue extends string> {
    state: {
        value: TValue;
        meta: { errors: unknown[] };
    };
    handleChange: (value: TValue) => void;
    handleBlur: () => void;
}

interface SelectOption<TValue extends string> {
    value: TValue;
    label: string;
}

interface FormSelectFieldProps<TValue extends string> {
    field: SelectField<TValue>;
    label: string;
    options: readonly SelectOption<TValue>[];
    testId?: string;
}

export function FormSelectField<TValue extends string>({ field, label, options, testId }: FormSelectFieldProps<TValue>) {
    const labelId = `${label.toLowerCase().replace(/\s+/g, "-")}-label`;
    const error = getFieldError(field.state.meta.errors);
    return (
        <FormControl fullWidth error={!!error} data-testid={testId}>
            <InputLabel id={labelId}>{label}</InputLabel>
            <Select
                labelId={labelId}
                label={label}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value as TValue)}
                onBlur={field.handleBlur}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    );
}
