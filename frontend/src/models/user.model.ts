import type { RegisterFormValues } from "~/pages/register/registerSchema";

export type RegisterPayload = Omit<RegisterFormValues, "confirmPassword">;

export type UserResponse = {
  id: string;
  username: string;
  email: string;
  document_type: string;
  document_number: string;
  full_name?: string;
  city?: string;
  phone?: string;
  is_superuser: boolean;
};
