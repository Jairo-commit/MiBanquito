import { isAxiosError } from "axios";

export const parseApiError = (error: unknown): string[] => {
    if (!isAxiosError(error) || !error.response?.data) {
        return ["Something went wrong. Please try again."];
    }

    const data = error.response.data as Record<string, unknown>;

    return Object.entries(data).flatMap(([key, value]) => {
        const messages = Array.isArray(value) ? value : [String(value)];
        if (key === "non_field_errors") return messages;
        return messages.map((msg) => `${key}: ${msg}`);
    });
};
