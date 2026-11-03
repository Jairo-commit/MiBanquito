# products app

`LoanRequest` and `CDT` models, exposed as ModelViewSets. The app has no tests yet; when adding `products/tests.py`, follow `.claude/rules/backend/testing.md` and use `transactions/tests.py` as the reference.

## Endpoints

| Endpoint | Router basename | Methods | Auth required |
|----------|-----------------|---------|---------------|
| `/api/products/loans/` | `loans` | GET, POST | Yes |
| `/api/products/loans/{id}/` | `loans` | GET, PUT, PATCH, DELETE | Yes |
| `/api/products/cdts/` | `cdts` | GET, POST | Yes |
| `/api/products/cdts/{id}/` | `cdts` | GET, PUT, PATCH, DELETE | Yes |

## Known gaps

- `LoanRequestViewSet` and `CDTViewSet` use `queryset = Model.objects.all()`, so any authenticated user can reach every user's records. Scope them in `get_queryset()` (see `.claude/rules/backend/views-and-permissions.md`).
- The serializers accept `user` and `status` from the payload; both should be read-only and `user` set from `request.user`.
