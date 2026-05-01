# Testing patterns — users app

Tests live in `users/tests.py` and cover the public registration and login endpoints.

## Key conventions

**Database access** — mark at class level, not per method:
```python
@pytest.mark.django_db
class TestSomeEndpoint:
    def test_something(self, api_client): ...
```

**Fixtures** — define locally in `tests.py`; only `api_client` is needed for public endpoints:
```python
@pytest.fixture
def api_client():
    return APIClient()
```

**User creation** — always use `UserFactory` (from `users/factories.py`), never raw `User.objects.create_user()`:
```python
from users.factories import UserFactory

user = UserFactory(username="specific")   # override only what the test cares about
```
`UserFactory` hashes the password via `set_password("SecurePass1@")`, so factory-built users can authenticate through the real JWT endpoint.

**Grouping similar assertions** — use `@pytest.mark.parametrize` when multiple cases share the same arrange–act–assert body (e.g., all invalid payloads → 400, all bad credentials → 401). Give each case a readable `id=`:
```python
@pytest.mark.parametrize("override", [
    pytest.param({"username": ""}, id="empty_username"),
    pytest.param({"email": "bad"}, id="malformed_email"),
])
def test_invalid_payload_returns_400(self, api_client, override):
    payload = {**VALID_PAYLOAD, **override}
    assert api_client.post(URL, payload).status_code == 400
```

**Payloads** — plain `dict`; DRF's test client handles content-type automatically.

**Assertions** — check `response.status_code` first, then `response.data` keys/values. Never assert on raw `response.content`.

## Endpoints under test

| Endpoint | Method | Auth required |
|----------|--------|---------------|
| `/api/user/register/` | POST | No |
| `/api/token/` | POST | No |
