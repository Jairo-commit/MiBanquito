---
paths:
  - "backend/**/views.py"
  - "backend/**/serializers.py"
  - "backend/core/urls.py"
---

# Views, permissions and API errors

- **A user only ever reaches their own records.** Scope data in `get_queryset()`, never with a class-level `queryset = Model.objects.all()`. Superusers see everything.
  ```python
  def get_queryset(self):
      if self.request.user.is_superuser:
          return SavingsAccount.objects.all()
      return SavingsAccount.objects.filter(user=self.request.user)
  ```
  - `products/views.py` still exposes every user's loans and CDTs; fix it when you touch it.
- **The owner comes from the request, never from the payload.** Set it in `perform_create` with `serializer.save(user=self.request.user)` and mark `user` as `read_only` in the serializer.
- **Check ownership of every account referenced in the payload** before acting on it, and raise `PermissionDenied` when it belongs to someone else (see `TransactionViewSet.perform_create`).
- **Declare `permission_classes` on every view**, even though `IsAuthenticated` is the default. Only public endpoints (register, token) use `AllowAny`.
- **Resources are ViewSets registered on the `DefaultRouter` in `core/urls.py` with an explicit `basename`.** Tests build URLs from that basename: `reverse("accounts-list")`, `reverse("accounts-detail", args=[pk])`. One-off endpoints (`user/register/`, `user/me/`) are generic views with a `name=`.
- **Translate Django's `ValidationError` into DRF's at the serializer boundary.** Helpers and managers raise `django.core.exceptions.ValidationError`; the serializer catches it and raises `rest_framework.exceptions.ValidationError`, so the client gets a 400 instead of a 500. Import them aliased: `ValidationError as DjangoValidationError`, `ValidationError as DRFValidationError`.
- **Error bodies stay in the shape the frontend's `parseApiError` reads**: `{"field": ["message"]}`, `{"non_field_errors": [...]}` or `{"detail": "message"}`.
- **List fields explicitly in `Meta.fields`; never `"__all__"`.** Server-owned fields (`status`, `reference`, `created_at`, `account_number`, `user`) go in `extra_kwargs` as `read_only`; secrets such as `password` are `write_only`.
- **Read-only derived fields are `SerializerMethodField`s with `get_<field>`** and handle a null relation (`return None`).
