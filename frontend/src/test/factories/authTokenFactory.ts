import type { AuthToken } from "~/models/authToken";

export const authTokenFactory = (overrides: Partial<AuthToken> = {}): AuthToken => ({
  access: "fake-access-token",
  refresh: "fake-refresh-token",
  ...overrides,
});
