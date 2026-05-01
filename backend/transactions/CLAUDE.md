# Testing patterns — transactions app

Tests live in `transactions/tests.py` and cover authenticated transfer and listing endpoints.

## Key conventions

**Database access** — pass the `db` fixture to each test method that needs it (pytest-django marks the test as DB-enabled):
```python
class TestSomething:
    def test_something(self, db, authenticated_client, ...): ...
```

**Fixtures** — define locally in `tests.py`. The standard set:
```python
@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user(db):
    return User.objects.create_user(username="testuser", email="test@example.com",
        password="SecurePass1@", document_type="CC", document_number="999888777")

@pytest.fixture
def authenticated_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client
```

Use `force_authenticate()` — never POST to `/api/token/` to get a token in tests; that couples tests to the auth flow unnecessarily.

**User creation** — use `User.objects.create_user()` directly inside fixtures. For secondary users needed within a test body, also call `create_user()` inline.

**Payloads** — plain `dict`; DRF's test client handles content-type automatically.

**Assertions** — check `response.status_code` first, then inspect DB state (call `.refresh_from_db()` before reading updated fields), then check related objects with `.filter().exists()` or `.first()`.

**Class organisation** — one class per logical feature or resource (e.g., `TestTransfer`, `TestTransactionList`). Keep each test focused on a single behaviour.

## Endpoints under test

| Endpoint | Method | Auth required |
|----------|--------|---------------|
| `/api/transactions/transfer/` | POST | Yes |
| `/api/transactions/` | GET | Yes |
