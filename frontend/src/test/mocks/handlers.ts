import { http, HttpResponse } from "msw";
import { authTokenFactory } from "~/test/factories/authTokenFactory";
import { userResponseFactory } from "~/test/factories/userResponseFactory";

const BASE = "http://localhost:8000";

export const handlers = [
  http.post(`${BASE}/token/`, () => {
    return HttpResponse.json(authTokenFactory());
  }),

  http.post(`${BASE}/user/register/`, () => {
    return HttpResponse.json(userResponseFactory(), { status: 201 });
  }),
];
