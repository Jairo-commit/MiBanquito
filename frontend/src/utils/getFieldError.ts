export function getFieldError(errors: unknown[]): string | undefined {
    const error = errors[0];
    if (!error) return undefined;
    if (typeof error === "string") return error;
    if (typeof error === "object" && "message" in (error as object)) {
        return (error as { message: string }).message;
    }
    return undefined;
}
