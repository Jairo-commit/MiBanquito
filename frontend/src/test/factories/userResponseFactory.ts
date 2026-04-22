import type { UserResponse } from "~/models/user";

export const userResponseFactory = (overrides: Partial<UserResponse> = {}): UserResponse => ({
  id: "1",
  username: "testuser",
  email: "test@example.com",
  document_type: "CC",
  document_number: "123456789",
  full_name: "Test User",
  city: "Bogotá",
  phone: "3001234567",
  ...overrides,
});
