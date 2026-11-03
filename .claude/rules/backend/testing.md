---
paths:
  - "backend/**/tests.py"
  - "backend/**/test_*.py"
  - "backend/**/factories.py"
---

# Backend tests

- **Tests are pytest classes in the app's `tests.py`, one class per behaviour** (`TestCreateInternalTransaction`, `TestTransactionVisibility`), marked `@pytest.mark.django_db` at class level. Run them with `docker compose exec backend pytest`.
- **Build users with `UserFactory` from `users/factories.py`, overriding only what the test cares about.** Never call `User.objects.create_user()` with a hand-built payload. The factory sets the password `SecurePass1@`, so its users can log in through the real token endpoint.
  - Bad: `User.objects.create_user(username="testuser", email="test@example.com", password="...", document_type="CC", document_number="999888777")`
  - Good: `UserFactory()`, or `UserFactory(username="specific")`
- **Create domain records through their managers**, as `SavingsAccount.objects.create_account(user=user, balance=Decimal("500000"))`, so tests exercise the same rules as production.
- **Authenticate with `force_authenticate()`.** Only tests of the login flow itself POST to `/api/token/`. The shared fixture returns the client and its user together: `client, user = authenticated_client`.
- **Fixtures live at the top of the app's `tests.py`**: `api_client`, `authenticated_client`, plus the records the app needs (`account`, `second_account`). A user needed by only one test is created inline in that test.
- **Build URLs with `reverse()` from the router basename** in module-level constants (`ACCOUNTS_URL = reverse("accounts-list")`) and small helpers (`account_detail_url(pk)`). Never hard-code `/api/...` paths.
- **Assert the status code first, then the persisted state.** Call `refresh_from_db()` before reading changed fields, and query the database (`.filter().exists()`, `.count()`) when the intent is a side effect, not just `response.data`.
- **Every endpoint gets a data-isolation test**: create records for two users and assert the authenticated one sees only theirs, and that another user's record returns 404.
- **Cases that share one arrange-act-assert body use `@pytest.mark.parametrize` with a readable `id=`** on each `pytest.param`.
- **Name tests for the behaviour and its outcome**: `test_internal_transaction_insufficient_funds_returns_400`, `test_password_not_returned_in_response`.
- **References**: `transactions/tests.py`, `users/tests.py`.
