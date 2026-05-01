# Testing patterns — products app

Tests live in `products/tests.py` and cover authenticated loan and CDT endpoints.

## Key conventions

**Database access** — pass the `db` fixture to each test method that needs it:
```python
class TestSomething:
    def test_something(self, db, authenticated_client): ...
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

Use `force_authenticate()` — never POST to `/api/token/` to get a token in tests.

**User creation** — use `User.objects.create_user()` directly. When a test needs a second user (e.g., to verify data isolation), create them inline inside the test body rather than adding another fixture.

**Payloads** — plain `dict`; DRF's test client handles content-type automatically.

**Assertions** — check `response.status_code` first, then query the DB directly (`Model.objects.first()`, `.count()`) to verify side effects. Avoid asserting only on `response.data` when the real intent is to check persisted state.

**Data isolation tests** — verify that a user only sees their own records by creating objects for two different users and asserting the list count equals 1 for the authenticated user.

**Class organisation** — one class per model/resource (e.g., `TestLoanRequestViews`, `TestCDTViews`).

## Endpoints under test

| Endpoint | Method | Auth required |
|----------|--------|---------------|
| `/api/products/loans/` | POST, GET | Yes |
| `/api/products/loans/{id}/` | PATCH, PUT | Yes (405 — not allowed) |
| `/api/products/cdts/` | POST, GET | Yes |
