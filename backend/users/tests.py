import pytest
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from rest_framework.test import APIClient
from users.validators import BankPasswordValidator

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def valid_user_data():
    return {
        "document_type": "CC",
        "document_number": "123456789",
        "full_name": "Ana García",
        "city": "Bogotá",
        "phone": "3001234567",
        "email": "ana@example.com",
        "occupation": "EMPLOYEE",
        "password": "SecurePass1@",
        "password_confirm": "SecurePass1@",
    }


@pytest.fixture
def registered_user(db, valid_user_data):
    user = User.objects.create_user(
        username="ana",
        email=valid_user_data["email"],
        password=valid_user_data["password"],
        document_type=valid_user_data["document_type"],
        document_number=valid_user_data["document_number"],
        full_name=valid_user_data["full_name"],
        city=valid_user_data["city"],
        phone=valid_user_data["phone"],
        occupation=valid_user_data["occupation"],
    )
    return user


class TestBankPasswordValidator:
    def test_valid_password_passes(self):
        validator = BankPasswordValidator()
        validator.validate("SecurePass1@")

    @pytest.mark.parametrize(
        "password,expected_fragment",
        [
            ("Short1@", "characters"),
            ("alllowercase1@", "uppercase"),
            ("ALLUPPERCASE1@", "lowercase"),
            ("NoDigitHere@@", "digit"),
            ("NoSpecialChar1", "special"),
        ],
    )
    def test_invalid_passwords_raise_validation_error(
        self, password, expected_fragment
    ):
        validator = BankPasswordValidator()
        with pytest.raises(ValidationError) as exc_info:
            validator.validate(password)
        messages = str(exc_info.value)
        assert expected_fragment in messages

    def test_multiple_failures_listed_together(self):
        validator = BankPasswordValidator()
        with pytest.raises(ValidationError) as exc_info:
            validator.validate("short")
        errors = exc_info.value.messages
        assert len(errors) > 1

    def test_get_help_text_returns_string(self):
        validator = BankPasswordValidator()
        assert isinstance(validator.get_help_text(), str)


class TestUserRegisterView:
    def test_register_creates_user(self, db, api_client, valid_user_data):
        response = api_client.post("/api/users/register/", valid_user_data)
        assert response.status_code == 201
        assert User.objects.filter(email=valid_user_data["email"]).exists()

    def test_register_with_mismatched_passwords_fails(
        self, db, api_client, valid_user_data
    ):
        valid_user_data["password_confirm"] = "DifferentPass1@"
        response = api_client.post("/api/users/register/", valid_user_data)
        assert response.status_code == 400

    def test_register_with_duplicate_email_fails(
        self, db, api_client, valid_user_data, registered_user
    ):
        response = api_client.post("/api/users/register/", valid_user_data)
        assert response.status_code == 400

    def test_register_with_weak_password_fails(self, db, api_client, valid_user_data):
        valid_user_data["password"] = "weak"
        valid_user_data["password_confirm"] = "weak"
        response = api_client.post("/api/users/register/", valid_user_data)
        assert response.status_code == 400


class TestAuthViews:
    def test_login_with_valid_credentials_returns_profile(
        self, db, api_client, registered_user
    ):
        response = api_client.post(
            "/api/auth/login/",
            {
                "email": registered_user.email,
                "password": "SecurePass1@",
            },
        )
        assert response.status_code == 200
        assert response.data["email"] == registered_user.email

    def test_login_with_wrong_password_returns_401(
        self, db, api_client, registered_user
    ):
        response = api_client.post(
            "/api/auth/login/",
            {
                "email": registered_user.email,
                "password": "WrongPassword1@",
            },
        )
        assert response.status_code == 401

    def test_logout_requires_authentication(self, db, api_client):
        response = api_client.post("/api/auth/logout/")
        assert response.status_code in [401, 403]

    def test_logout_succeeds_for_authenticated_user(
        self, db, api_client, registered_user
    ):
        api_client.force_authenticate(user=registered_user)
        response = api_client.post("/api/auth/logout/")
        assert response.status_code == 200


class TestMeView:
    def test_me_returns_user_profile(self, db, api_client, registered_user):
        api_client.force_authenticate(user=registered_user)
        response = api_client.get("/api/users/me/")
        assert response.status_code == 200
        assert response.data["email"] == registered_user.email

    def test_me_requires_authentication(self, db, api_client):
        response = api_client.get("/api/users/me/")
        assert response.status_code in [401, 403]

    def test_me_update_mutable_fields(self, db, api_client, registered_user):
        api_client.force_authenticate(user=registered_user)
        response = api_client.put("/api/users/me/", {"city": "Medellín"})
        assert response.status_code == 200
        registered_user.refresh_from_db()
        assert registered_user.city == "Medellín"
