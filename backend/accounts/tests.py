import pytest
from decimal import Decimal
from django.urls import reverse
from rest_framework.test import APIClient
from users.factories import UserFactory
from accounts.models import SavingsAccount

ACCOUNTS_URL = reverse("accounts-list")


def account_detail_url(account_id):
    return reverse("accounts-detail", args=[account_id])


VALID_ACCOUNT_PAYLOAD = {
    "balance": "150000.00",
}


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def authenticated_client(api_client):
    user = UserFactory()
    api_client.force_authenticate(user=user)
    return api_client, user


@pytest.mark.django_db
class TestCreateSavingsAccount:
    def test_create_account_with_valid_balance_succeeds(self, authenticated_client):
        client, _ = authenticated_client
        response = client.post(ACCOUNTS_URL, VALID_ACCOUNT_PAYLOAD)

        assert response.status_code == 201
        assert response.data["balance"] == "150000.00"
        assert response.data["is_active"] is True
        assert "account_number" in response.data
        assert response.data["account_number"].startswith("MB")

    def test_account_number_is_auto_generated(self, authenticated_client):
        client, _ = authenticated_client
        response = client.post(ACCOUNTS_URL, VALID_ACCOUNT_PAYLOAD)

        assert response.status_code == 201
        assert len(response.data["account_number"]) == 12  # MB + 10 digits

    def test_account_number_is_unique(self, authenticated_client):
        client, _ = authenticated_client
        response_1 = client.post(ACCOUNTS_URL, VALID_ACCOUNT_PAYLOAD)
        response_2 = client.post(ACCOUNTS_URL, VALID_ACCOUNT_PAYLOAD)

        assert response_1.data["account_number"] != response_2.data["account_number"]

    def test_account_is_assigned_to_authenticated_user(self, authenticated_client):
        client, user = authenticated_client
        response = client.post(ACCOUNTS_URL, VALID_ACCOUNT_PAYLOAD)

        assert response.status_code == 201
        account = SavingsAccount.objects.get(id=response.data["id"])
        assert account.user == user

    def test_user_cannot_create_account_for_another_user(self, authenticated_client):
        client, user = authenticated_client
        other_user = UserFactory()
        response = client.post(ACCOUNTS_URL, {**VALID_ACCOUNT_PAYLOAD, "user": other_user.id})

        assert response.status_code == 201
        account = SavingsAccount.objects.get(id=response.data["id"])
        assert account.user == user
        assert account.user != other_user

    def test_account_number_not_writable(self, authenticated_client):
        client, _ = authenticated_client
        payload = {**VALID_ACCOUNT_PAYLOAD, "account_number": "MB9999999999"}
        response = client.post(ACCOUNTS_URL, payload)

        assert response.status_code == 201
        assert response.data["account_number"] != "MB9999999999"

    def test_unauthenticated_user_cannot_create_account(self, api_client):
        response = api_client.post(ACCOUNTS_URL, VALID_ACCOUNT_PAYLOAD)

        assert response.status_code == 401

    @pytest.mark.parametrize(
        "balance, expected_status",
        [
            pytest.param("100000.00", 201, id="exact_minimum_balance"),
            pytest.param("99999.99", 400, id="below_minimum_balance"),
            pytest.param("0.00", 400, id="zero_balance"),
            pytest.param("-1000.00", 400, id="negative_balance"),
            pytest.param("999999999.99", 201, id="large_balance"),
        ],
    )
    def test_balance_validation(self, authenticated_client, balance, expected_status):
        client, _ = authenticated_client
        response = client.post(ACCOUNTS_URL, {"balance": balance})

        assert response.status_code == expected_status

    def test_missing_balance_returns_400(self, authenticated_client):
        client, _ = authenticated_client
        response = client.post(ACCOUNTS_URL, {})

        assert response.status_code == 400


@pytest.mark.django_db
class TestRetrieveSavingsAccount:
    def test_unauthenticated_user_cannot_list_accounts(self, api_client):
        response = api_client.get(ACCOUNTS_URL)

        assert response.status_code == 401

    def test_authenticated_user_can_list_accounts(self, authenticated_client):
        client, user = authenticated_client
        SavingsAccount.objects.create_account(user=user, balance=Decimal("150000"))
        response = client.get(ACCOUNTS_URL)

        assert response.status_code == 200

    def test_authenticated_user_can_retrieve_own_account(self, authenticated_client):
        client, user = authenticated_client
        account = SavingsAccount.objects.create_account(user=user, balance=Decimal("150000"))
        response = client.get(account_detail_url(account.id))

        assert response.status_code == 200
        assert response.data["account_number"] == account.account_number

    def test_response_contains_expected_fields(self, authenticated_client):
        client, user = authenticated_client
        SavingsAccount.objects.create_account(user=user, balance=Decimal("150000"))
        response = client.get(ACCOUNTS_URL)

        account_data = response.data["results"][0]
        assert "id" in account_data
        assert "account_number" in account_data
        assert "balance" in account_data
        assert "is_active" in account_data
        assert "created_at" in account_data


    def test_user_cannot_see_other_users_accounts(self, authenticated_client):
        client, _ = authenticated_client
        other_user = UserFactory()
        SavingsAccount.objects.create_account(user=other_user, balance=Decimal("150000"))
        response = client.get(ACCOUNTS_URL)

        assert response.status_code == 200
        assert response.data["count"] == 0

    def test_user_cannot_retrieve_other_users_account(self, authenticated_client):
        client, _ = authenticated_client
        other_user = UserFactory()
        account = SavingsAccount.objects.create_account(user=other_user, balance=Decimal("150000"))
        response = client.get(account_detail_url(account.id))

        assert response.status_code == 404

    def test_superuser_can_list_all_accounts(self, api_client):
        superuser = UserFactory(is_superuser=True, is_staff=True)
        other_user = UserFactory()
        SavingsAccount.objects.create_account(user=other_user, balance=Decimal("150000"))
        SavingsAccount.objects.create_account(user=other_user, balance=Decimal("200000"))
        api_client.force_authenticate(user=superuser)
        response = api_client.get(ACCOUNTS_URL)

        assert response.status_code == 200
        assert response.data["count"] == 2


@pytest.mark.django_db
class TestUpdateSavingsAccount:
    def test_unauthenticated_user_cannot_update_account(self, authenticated_client):
        _, user = authenticated_client
        account = SavingsAccount.objects.create_account(user=user, balance=Decimal("150000"))
        fresh_client = APIClient()
        response = fresh_client.patch(account_detail_url(account.id), {"balance": "200000.00"})

        assert response.status_code == 401

    def test_can_deactivate_account(self, authenticated_client):
        client, user = authenticated_client
        account = SavingsAccount.objects.create_account(user=user, balance=Decimal("150000"))
        response = client.patch(account_detail_url(account.id), {"is_active": False})

        assert response.status_code == 200
        account.refresh_from_db()
        assert account.is_active is False

    def test_account_number_cannot_be_updated(self, authenticated_client):
        client, user = authenticated_client
        account = SavingsAccount.objects.create_account(user=user, balance=Decimal("150000"))
        original_number = account.account_number
        response = client.patch(account_detail_url(account.id), {"account_number": "MB0000000000"})

        assert response.status_code == 200
        account.refresh_from_db()
        assert account.account_number == original_number
