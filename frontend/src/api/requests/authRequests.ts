import api from "~/api/api";
import type { RegisterPayload, UserResponse } from "~/models/user";
import type { AuthToken, LoginPayload } from "~/models/authToken";

export const postRegister = (payload: RegisterPayload): Promise<UserResponse> =>
  api.post("user/register/", payload).then((res) => res.data);

export const postLogin = (payload: LoginPayload): Promise<AuthToken> =>
  api.post("token/", payload).then((res) => res.data);

export const getMe = (): Promise<UserResponse> =>
  api.get("user/me/").then((res) => res.data);
