# Testing patterns — transactions app

Tests live in `transactions/tests.py` and cover creating, listing, retrieving and protecting transactions. General conventions are in `.claude/rules/backend/testing.md`.

## Key conventions

**Database access** — mark at class level:
```python
@pytest.mark.django_db
class TestCreateInternalTransaction:
    def test_internal_transaction_succeeds(self, authenticated_client, account, second_account): ...
```

**Fixtures** — defined at the top of `tests.py`:
```python
@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def authenticated_client(api_client):
    user = UserFactory()
    api_client.force_authenticate(user=user)
    return api_client, user

@pytest.fixture
def account(authenticated_client):
    _, user = authenticated_client
    return SavingsAccount.objects.create_account(user=user, balance=Decimal("500000"))

@pytest.fixture
def second_account(db):
    user = UserFactory()
    return SavingsAccount.objects.create_account(user=user, balance=Decimal("500000"))
```

Unpack the client as `client, _ = authenticated_client` (or `client, user = ...` when the user is needed). Use `force_authenticate()` — never POST to `/api/token/` to get a token in tests.

**Records** — create users with `UserFactory`, accounts with `SavingsAccount.objects.create_account()` and transactions with `Transaction.objects.create_internal_transaction()`, so tests run through the same validation as production.

**URLs** — `TRANSACTIONS_URL = reverse("transactions-list")` and `transaction_detail_url(pk)`; never hard-code paths.

**Payloads** — plain `dict` with amounts as strings (`"100000.00"`).

**Assertions** — check `response.status_code` first, then DB state (call `.refresh_from_db()` before reading updated balances).

**Class organisation** — one class per behaviour: `TestCreateInternalTransaction`, `TestCreateExternalTransaction`, `TestAmountValidation`, `TestRetrieveTransaction`, `TestTransactionImmutability`, `TestTransactionVisibility`.

## Endpoints under test

| Endpoint | Method | Expected |
|----------|--------|----------|
| `/api/transactions/` | POST | 201 on success, 400 on a broken rule |
| `/api/transactions/` | GET | Only transactions where the user owns the source or destination account |
| `/api/transactions/{id}/` | GET | 404 for an unrelated transaction |
| `/api/transactions/{id}/` | PATCH | 400 |
| `/api/transactions/{id}/` | DELETE | 403 |
