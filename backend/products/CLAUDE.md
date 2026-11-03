# products app

`LoanRequest` and `CDT` models, exposed as ModelViewSets. Each user only reaches their own records (superusers reach all), and `user`, `status` and review fields are set by the server, never by the payload.

Tests live in `products/tests.py`. General conventions are in `.claude/rules/backend/testing.md`; records are built with the local `create_loan(user, **overrides)` and `create_cdt(user, **overrides)` helpers.

## Endpoints

| Endpoint | Router basename | Methods | Auth required |
|----------|-----------------|---------|---------------|
| `/api/products/loans/` | `loans` | GET, POST | Yes |
| `/api/products/loans/{id}/` | `loans` | GET, PUT, PATCH, DELETE | Yes |
| `/api/products/cdts/` | `cdts` | GET, POST | Yes |
| `/api/products/cdts/{id}/` | `cdts` | GET, PUT, PATCH, DELETE | Yes |
