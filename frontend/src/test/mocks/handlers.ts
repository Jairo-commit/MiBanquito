import { http, HttpResponse } from "msw";
import { authTokenFactory } from "~/test/factories/authTokenFactory";
import { userResponseFactory } from "~/test/factories/userResponseFactory";
import { accountFactory } from "~/test/factories/accountFactory";
import { transactionFactory } from "~/test/factories/transactionFactory";
import { loanRequestFactory } from "~/test/factories/loanRequestFactory";
import { cdtFactory } from "~/test/factories/cdtFactory";

const BASE = "http://localhost:8000";

export const handlers = [
  http.post(`${BASE}/token/`, () => {
    return HttpResponse.json(authTokenFactory.build());
  }),

  http.post(`${BASE}/user/register/`, () => {
    return HttpResponse.json(userResponseFactory.build(), { status: 201 });
  }),

  http.get(`${BASE}/user/me/`, () => {
    return HttpResponse.json(userResponseFactory.build());
  }),

  http.get(`${BASE}/accounts/`, () => {
    return HttpResponse.json({ results: [accountFactory.build()] });
  }),

  http.get(`${BASE}/transactions/`, () => {
    return HttpResponse.json({ results: [transactionFactory.build()] });
  }),

  http.post(`${BASE}/transactions/`, () =>
    HttpResponse.json(transactionFactory.build(), { status: 201 })
  ),

  http.post(`${BASE}/accounts/`, () =>
    HttpResponse.json(accountFactory.build(), { status: 201 })
  ),
  http.post(`${BASE}/products/loans/`, () =>
    HttpResponse.json(loanRequestFactory.build(), { status: 201 })
  ),
  http.post(`${BASE}/products/cdts/`, () =>
    HttpResponse.json(cdtFactory.build(), { status: 201 })
  ),
];
