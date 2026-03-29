import pytest
from decimal import Decimal
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from accounts.models import AccountMovement, SavingsAccount
from transactions.models import Transaction

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
        occupation="EMPLOYEE",
    )


@pytest.fixture
def other_user(db):
    return User.objects.create_user(
        username="other",
        email="other@example.com",
        password="SecurePass1@",
        document_type="CC",
        document_number="111222333",
        full_name="Other User",
        city="Cali",
        phone="3009876543",
        occupation="INDEPENDENT",
    )


@pytest.fixture
def source_account(user):
    account = SavingsAccount(user=user, balance=Decimal("1000000"))
    account.save()
    return account


@pytest.fixture
def destination_account(other_user):
    account = SavingsAccount(user=other_user, balance=Decimal("0"))
    account.save()
    return account


@pytest.fixture
def authenticated_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


class TestTransfer:
    def test_successful_transfer_updates_balances(
        self, db, authenticated_client, source_account, destination_account
    ):
        response = authenticated_client.post(
            "/api/transactions/transfer/",
            {
                "source_account_id": str(source_account.id),
                "destination_account_id": str(destination_account.id),
                "amount": "300000",
            },
        )
        assert response.status_code == 201
        source_account.refresh_from_db()
        destination_account.refresh_from_db()
        assert source_account.balance == Decimal("700000")
        assert destination_account.balance == Decimal("300000")

    def test_successful_transfer_creates_movements(
        self, db, authenticated_client, source_account, destination_account
    ):
        authenticated_client.post(
            "/api/transactions/transfer/",
            {
                "source_account_id": str(source_account.id),
                "destination_account_id": str(destination_account.id),
                "amount": "300000",
            },
        )
        assert AccountMovement.objects.filter(
            account=source_account,
            movement_type=AccountMovement.MOVEMENT_TRANSFER_OUT,
        ).exists()
        assert AccountMovement.objects.filter(
            account=destination_account,
            movement_type=AccountMovement.MOVEMENT_TRANSFER_IN,
        ).exists()

    def test_successful_transfer_creates_completed_transaction(
        self, db, authenticated_client, source_account, destination_account
    ):
        authenticated_client.post(
            "/api/transactions/transfer/",
            {
                "source_account_id": str(source_account.id),
                "destination_account_id": str(destination_account.id),
                "amount": "300000",
            },
        )
        transaction = Transaction.objects.first()
        assert transaction is not None
        assert transaction.status == Transaction.STATUS_COMPLETED

    def test_transfer_with_insufficient_balance_fails(
        self, db, authenticated_client, source_account, destination_account
    ):
        response = authenticated_client.post(
            "/api/transactions/transfer/",
            {
                "source_account_id": str(source_account.id),
                "destination_account_id": str(destination_account.id),
                "amount": "9999999",
            },
        )
        assert response.status_code == 400
        source_account.refresh_from_db()
        assert source_account.balance == Decimal("1000000")

    def test_transfer_from_another_users_account_is_forbidden(
        self, db, authenticated_client, destination_account, source_account
    ):
        other_account = destination_account
        response = authenticated_client.post(
            "/api/transactions/transfer/",
            {
                "source_account_id": str(other_account.id),
                "destination_account_id": str(source_account.id),
                "amount": "100000",
            },
        )
        assert response.status_code == 403

    def test_transfer_with_zero_amount_fails(
        self, db, authenticated_client, source_account, destination_account
    ):
        response = authenticated_client.post(
            "/api/transactions/transfer/",
            {
                "source_account_id": str(source_account.id),
                "destination_account_id": str(destination_account.id),
                "amount": "0",
            },
        )
        assert response.status_code == 400


class TestTransactionList:
    def test_list_includes_outgoing_transactions(
        self, db, authenticated_client, source_account, destination_account
    ):
        authenticated_client.post(
            "/api/transactions/transfer/",
            {
                "source_account_id": str(source_account.id),
                "destination_account_id": str(destination_account.id),
                "amount": "100000",
            },
        )
        response = authenticated_client.get("/api/transactions/")
        assert response.status_code == 200
        assert len(response.data) >= 1
