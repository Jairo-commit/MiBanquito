import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from users.factories import UserFactory

REGISTER_URL = reverse("register")
LOGIN_URL = reverse("token_obtain")
ME_URL = reverse("current-user")

VALID_REGISTER_PAYLOAD = {
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "SecurePass1@",
    "document_type": "CC",
    "document_number": "987654321",
}


@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
class TestRegisterEndpoint:
    def test_register_with_required_fields_succeeds(self, api_client):
        response = api_client.post(REGISTER_URL, VALID_REGISTER_PAYLOAD)

        assert response.status_code == 201
        assert response.data["username"] == VALID_REGISTER_PAYLOAD["username"]
        assert response.data["email"] == VALID_REGISTER_PAYLOAD["email"]
        assert response.data["document_type"] == VALID_REGISTER_PAYLOAD["document_type"]
        assert response.data["document_number"] == VALID_REGISTER_PAYLOAD["document_number"]

    def test_register_with_all_fields_succeeds(self, api_client):
        payload = {
            **VALID_REGISTER_PAYLOAD,
            "full_name": "New User",
            "city": "Bogotá",
            "phone": "3001234567",
        }
        response = api_client.post(REGISTER_URL, payload)

        assert response.status_code == 201
        assert response.data["full_name"] == "New User"
        assert response.data["city"] == "Bogotá"
        assert response.data["phone"] == "3001234567"

    def test_password_not_returned_in_response(self, api_client):
        response = api_client.post(REGISTER_URL, VALID_REGISTER_PAYLOAD)

        assert "password" not in response.data

    @pytest.mark.parametrize(
        "override",
        [
            pytest.param({"username": ""}, id="empty_username"),
            pytest.param({"email": ""}, id="empty_email"),
            pytest.param({"password": ""}, id="empty_password"),
            pytest.param({"document_number": ""}, id="empty_document_number"),
            pytest.param({"document_type": "XX"}, id="invalid_document_type"),
            pytest.param({"email": "not-an-email"}, id="malformed_email"),
        ],
    )
    def test_invalid_payload_returns_400(self, api_client, override):
        payload = {**VALID_REGISTER_PAYLOAD, **override}
        response = api_client.post(REGISTER_URL, payload)

        assert response.status_code == 400

    @pytest.mark.parametrize(
        "duplicate_field",
        [
            pytest.param("email", id="duplicate_email"),
            pytest.param("document_number", id="duplicate_document_number"),
        ],
    )
    def test_duplicate_unique_field_returns_400(self, api_client, duplicate_field):
        existing = UserFactory(
            email=VALID_REGISTER_PAYLOAD["email"],
            document_number=VALID_REGISTER_PAYLOAD["document_number"],
        )
        payload = {**VALID_REGISTER_PAYLOAD, duplicate_field: getattr(existing, duplicate_field)}
        response = api_client.post(REGISTER_URL, payload)

        assert response.status_code == 400


@pytest.mark.django_db
class TestLoginEndpoint:
    def test_login_with_valid_credentials_returns_tokens(self, api_client):
        UserFactory(username="loginuser")
        response = api_client.post(LOGIN_URL, {"username": "loginuser", "password": "SecurePass1@"})

        assert response.status_code == 200
        assert "access" in response.data
        assert "refresh" in response.data

    @pytest.mark.parametrize(
        "payload",
        [
            pytest.param({"username": "loginuser", "password": "WrongPass!"}, id="wrong_password"),
            pytest.param({"username": "nobody", "password": "SecurePass1@"}, id="nonexistent_user"),
        ],
    )
    def test_login_with_invalid_credentials_returns_401(self, api_client, payload):
        UserFactory(username="loginuser")
        response = api_client.post(LOGIN_URL, payload)

        assert response.status_code == 401

    @pytest.mark.parametrize(
        "payload",
        [
            pytest.param({"username": "loginuser"}, id="missing_password"),
            pytest.param({"password": "SecurePass1@"}, id="missing_username"),
        ],
    )
    def test_login_with_missing_fields_returns_400(self, api_client, payload):
        UserFactory(username="loginuser")
        response = api_client.post(LOGIN_URL, payload)

        assert response.status_code == 400


@pytest.mark.django_db
class TestCurrentUserEndpoint:
    def test_unauthenticated_returns_401(self, api_client):
        response = api_client.get(ME_URL)

        assert response.status_code == 401

    def test_returns_own_user_data(self, api_client):
        user = UserFactory(full_name="Ada Lovelace")
        api_client.force_authenticate(user=user)
        response = api_client.get(ME_URL)

        assert response.status_code == 200
        assert response.data["username"] == user.username
        assert response.data["email"] == user.email
        assert response.data["full_name"] == "Ada Lovelace"
        assert response.data["document_type"] == user.document_type
        assert response.data["document_number"] == user.document_number

    def test_password_not_returned(self, api_client):
        user = UserFactory()
        api_client.force_authenticate(user=user)
        response = api_client.get(ME_URL)

        assert "password" not in response.data

    def test_does_not_return_another_users_data(self, api_client):
        user_a = UserFactory()
        user_b = UserFactory()
        api_client.force_authenticate(user=user_a)
        response = api_client.get(ME_URL)

        assert response.data["username"] == user_a.username
        assert response.data["username"] != user_b.username

    def test_post_method_not_allowed(self, api_client):
        user = UserFactory()
        api_client.force_authenticate(user=user)
        response = api_client.post(ME_URL, {})

        assert response.status_code == 405
