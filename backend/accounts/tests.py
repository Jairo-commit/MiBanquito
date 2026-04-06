import pytest
from decimal import Decimal
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from accounts.models import AccountMovement, SavingsAccount

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    return User.objects.create_user(
        username="testuser",
        email="test@example.com",
        password="SecurePass1@",
        document_type="CC",
        document_number="999888777",
        full_name="Test User",
        city="Bogotá",
        phone="3001234567",
    )


@pytest.fixture
def authenticated_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture
def savings_account(user):
    account = SavingsAccount(user=user, balance=Decimal("500000"))
    account.save()
    return account


class TestSavingsAccountCreation:
    def test_create_account_with_valid_deposit(self, db, authenticated_client):
        response = authenticated_client.post(
            "/api/accounts/", {"initial_deposit": "200000"}
        )
        assert response.status_code == 201
        assert SavingsAccount.objects.count() == 1

    def test_create_account_generates_opening_movement(self, db, authenticated_client):
        authenticated_client.post("/api/accounts/", {"initial_deposit": "200000"})
        account = SavingsAccount.objects.first()
        movement = account.movements.first()
        assert movement.movement_type == AccountMovement.MOVEMENT_DEPOSIT
        assert movement.amount == Decimal("200000")

    def test_create_account_with_deposit_below_minimum_fails(
        self, db, authenticated_client
    ):
        response = authenticated_client.post(
            "/api/accounts/", {"initial_deposit": "50000"}
        )
        assert response.status_code == 400

    def test_create_account_requires_authentication(self, db, api_client):
        response = api_client.post("/api/accounts/", {"initial_deposit": "200000"})
        assert response.status_code in [401, 403]

    def test_account_number_starts_with_mb(self, db, authenticated_client):
        authenticated_client.post("/api/accounts/", {"initial_deposit": "200000"})
        account = SavingsAccount.objects.first()
        assert account.account_number.startswith("MB")
        assert len(account.account_number) == 12


class TestSavingsAccountList:
    def test_list_returns_only_user_accounts(
        self, db, authenticated_client, user, savings_account
    ):
        other_user = User.objects.create_user(
            username="other",
            email="other@example.com",
            password="SecurePass1@",
            document_type="CC",
            document_number="111222333",
            full_name="Other User",
            city="Cali",
            phone="3009876543",
        )
        other_account = SavingsAccount(user=other_user, balance=Decimal("100000"))
        other_account.save()
        response = authenticated_client.get("/api/accounts/")
        assert response.status_code == 200
        account_ids = [a["id"] for a in response.data["results"]]
        assert str(savings_account.id) in account_ids
        assert str(other_account.id) not in account_ids


class TestAccountMovements:
    def test_movements_endpoint_returns_movements(
        self, db, authenticated_client, savings_account
    ):
        AccountMovement.objects.create(
            account=savings_account,
            movement_type=AccountMovement.MOVEMENT_DEPOSIT,
            amount=Decimal("500000"),
            description="Test deposit",
        )
        response = authenticated_client.get(
            f"/api/accounts/{savings_account.id}/movements/"
        )
        assert response.status_code == 200
        assert response.data["count"] >= 1
