import { z } from "zod";

export const registerSchema = z
    .object({
        username: z.string().min(1, "Username is required").max(150, "Max 150 characters"),
        email: z.email("Please enter a valid email"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
        document_type: z.enum(["CC", "CE", "NIT", "PP"], {
            error: "Select a document type",
        }),
        document_number: z
            .string()
            .min(1, "Document number is required")
            .max(20, "Max 20 characters"),
        full_name: z.string().max(255, "Max 255 characters").optional(),
        city: z.string().max(100, "Max 100 characters").optional(),
        phone: z.string().max(20, "Max 20 characters").optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type RegisterFormValues = z.infer<typeof registerSchema>;
