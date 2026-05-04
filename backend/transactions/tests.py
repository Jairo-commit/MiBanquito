import pytest
from decimal import Decimal
from django.urls import reverse
from rest_framework.test import APIClient
from users.factories import UserFactory
from accounts.models import SavingsAccount
from transactions.models import Transaction

TRANSACTIONS_URL = reverse("transactions-list")


def transaction_detail_url(transaction_id):
    return reverse("transactions-detail", args=[transaction_id])


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


@pytest.mark.django_db
class TestCreateInternalTransaction:
    def test_internal_transaction_succeeds(self, authenticated_client, account, second_account):
        client, _ = authenticated_client
        payload = {
            "source_account": account.id,
            "destination_account": second_account.id,
            "transaction_type": "INTERNAL",
            "amount": "100000.00",
        }
        response = client.post(TRANSACTIONS_URL, payload)

        assert response.status_code == 201
        assert response.data["status"] == "COMPLETED"
        assert response.data["transaction_type"] == "INTERNAL"

    def test_internal_transaction_deducts_source_balance(self, authenticated_client, account, second_account):
        client, _ = authenticated_client
        payload = {
            "source_account": account.id,
            "destination_account": second_account.id,
            "transaction_type": "INTERNAL",
            "amount": "100000.00",
        }
        client.post(TRANSACTIONS_URL, payload)

        account.refresh_from_db()
        assert account.balance == Decimal("400000.00")

    def test_internal_transaction_credits_destination_balance(self, authenticated_client, account, second_account):
        client, _ = authenticated_client
        payload = {
            "source_account": account.id,
            "destination_account": second_account.id,
            "transaction_type": "INTERNAL",
            "amount": "100000.00",
        }
        client.post(TRANSACTIONS_URL, payload)

        second_account.refresh_from_db()
        assert second_account.balance == Decimal("600000.00")

    def test_internal_transaction_requires_destination_account(self, authenticated_client, account):
        client, _ = authenticated_client
        payload = {
            "source_account": account.id,
            "transaction_type": "INTERNAL",
            "amount": "100000.00",
        }
        response = client.post(TRANSACTIONS_URL, payload)

        assert response.status_code == 400

    def test_internal_transaction_same_account_returns_400(self, authenticated_client, account):
        client, _ = authenticated_client
        payload = {
            "source_account": account.id,
            "destination_account": account.id,
            "transaction_type": "INTERNAL",
            "amount": "100000.00",
        }
        response = client.post(TRANSACTIONS_URL, payload)

        assert response.status_code == 400

    def test_internal_transaction_insufficient_funds_returns_400(self, authenticated_client, account, second_account):
        client, _ = authenticated_client
        payload = {
            "source_account": account.id,
            "destination_account": second_account.id,
            "transaction_type": "INTERNAL",
            "amount": "999999.00",
        }
        response = client.post(TRANSACTIONS_URL, payload)

        assert response.status_code == 400

    def test_internal_transaction_inactive_source_returns_400(self, authenticated_client, account, second_account):
        client, _ = authenticated_client
        account.is_active = False
        account.save()
        payload = {
            "source_account": account.id,
            "destination_account": second_account.id,
            "transaction_type": "INTERNAL",
            "amount": "100000.00",
        }
        response = client.post(TRANSACTIONS_URL, payload)

        assert response.status_code == 400

    def test_internal_transaction_inactive_destination_returns_400(self, authenticated_client, account, second_account):
        client, _ = authenticated_client
        second_account.is_active = False
        second_account.save()
        payload = {
            "source_account": account.id,
            "destination_account": second_account.id,
            "transaction_type": "INTERNAL",
            "amount": "100000.00",
        }
        response = client.post(TRANSACTIONS_URL, payload)

        assert response.status_code == 400


@pytest.mark.django_db
class TestCreateExternalTransaction:
    def test_external_transaction_succeeds(self, authenticated_client, account):
        client, _ = authenticated_client
        payload = {
            "source_account": account.id,
            "transaction_type": "EXTERNAL",
            "amount": "100000.00",
        }
        response = client.post(TRANSACTIONS_URL, payload)

        assert response.status_code == 201
        assert response.data["status"] == "COMPLETED"
        assert response.data["transaction_type"] == "EXTERNAL"

    def test_external_transaction_deducts_source_balance(self, authenticated_client, account):
        client, _ = authenticated_client
        payload = {
            "source_account": account.id,
            "transaction_type": "EXTERNAL",
            "amount": "100000.00",
        }
        client.post(TRANSACTIONS_URL, payload)

        account.refresh_from_db()
        assert account.balance == Decimal("400000.00")

    def test_external_transaction_destination_is_null(self, authenticated_client, account):
        client, _ = authenticated_client
        payload = {
            "source_account": account.id,
            "transaction_type": "EXTERNAL",
            "amount": "100000.00",
        }
        response = client.post(TRANSACTIONS_URL, payload)

        assert response.data["destination_account"] is None

    def test_external_transaction_requires_source_account(self, authenticated_client):
        client, _ = authenticated_client
        payload = {
            "transaction_type": "EXTERNAL",
            "amount": "100000.00",
        }
        response = client.post(TRANSACTIONS_URL, payload)

        assert response.status_code == 400

    def test_external_transaction_insufficient_funds_returns_400(self, authenticated_client, account):
        client, _ = authenticated_client
        payload = {
            "source_account": account.id,
            "transaction_type": "EXTERNAL",
            "amount": "999999.00",
        }
        response = client.post(TRANSACTIONS_URL, payload)

        assert response.status_code == 400

    def test_external_transaction_inactive_source_returns_400(self, authenticated_client, account):
        client, _ = authenticated_client
        account.is_active = False
        account.save()
        payload = {
            "source_account": account.id,
            "transaction_type": "EXTERNAL",
            "amount": "100000.00",
        }
        response = client.post(TRANSACTIONS_URL, payload)

        assert response.status_code == 400


@pytest.mark.django_db
class TestAmountValidation:
    @pytest.mark.parametrize(
        "amount, expected_status",
        [
            pytest.param("0.01", 201, id="minimum_valid_amount"),
            pytest.param("0.00", 400, id="zero_amount"),
            pytest.param("-100.00", 400, id="negative_amount"),
        ],
    )
    def test_amount_validation(self, authenticated_client, account, second_account, amount, expected_status):
        client, _ = authenticated_client
        payload = {
            "source_account": account.id,
            "destination_account": second_account.id,
            "transaction_type": "INTERNAL",
            "amount": amount,
        }
        response = client.post(TRANSACTIONS_URL, payload)

        assert response.status_code == expected_status


@pytest.mark.django_db
class TestRetrieveTransaction:
    def test_unauthenticated_user_cannot_list_transactions(self, api_client):
        response = api_client.get(TRANSACTIONS_URL)

        assert response.status_code == 401

    def test_authenticated_user_can_list_transactions(self, authenticated_client, account, second_account):
        client, _ = authenticated_client
        Transaction.objects.create_internal_transaction(
            source_account=account,
            destination_account=second_account,
            amount=Decimal("100000"),
        )
        response = client.get(TRANSACTIONS_URL)

        assert response.status_code == 200

    def test_authenticated_user_can_retrieve_transaction(self, authenticated_client, account, second_account):
        client, _ = authenticated_client
        txn = Transaction.objects.create_internal_transaction(
            source_account=account,
            destination_account=second_account,
            amount=Decimal("100000"),
        )
        response = client.get(transaction_detail_url(txn.id))

        assert response.status_code == 200
        assert str(response.data["id"]) == str(txn.id)

    def test_response_contains_expected_fields(self, authenticated_client, account, second_account):
        client, _ = authenticated_client
        Transaction.objects.create_internal_transaction(
            source_account=account,
            destination_account=second_account,
            amount=Decimal("100000"),
        )
        response = client.get(TRANSACTIONS_URL)

        transaction_data = response.data["results"][0]
        assert "id" in transaction_data
        assert "source_account" in transaction_data
        assert "destination_account" in transaction_data
        assert "transaction_type" in transaction_data
        assert "amount" in transaction_data
        assert "status" in transaction_data
        assert "reference" in transaction_data
        assert "created_at" in transaction_data


@pytest.mark.django_db
class TestTransactionImmutability:
    def test_cannot_update_transaction(self, authenticated_client, account, second_account):
        client, _ = authenticated_client
        txn = Transaction.objects.create_internal_transaction(
            source_account=account,
            destination_account=second_account,
            amount=Decimal("100000"),
        )
        response = client.patch(transaction_detail_url(txn.id), {"amount": "999999.00"})

        assert response.status_code == 400

    def test_can_delete_transaction(self, authenticated_client, account, second_account):
        client, _ = authenticated_client
        txn = Transaction.objects.create_internal_transaction(
            source_account=account,
            destination_account=second_account,
            amount=Decimal("100000"),
        )
        response = client.delete(transaction_detail_url(txn.id))

        assert response.status_code == 204


@pytest.mark.django_db
class TestTransactionVisibility:
    def test_user_can_see_transaction_as_destination(self, authenticated_client, second_account):
        client, user = authenticated_client
        user_account = SavingsAccount.objects.create_account(user=user, balance=Decimal("500000"))
        Transaction.objects.create_internal_transaction(
            source_account=second_account,
            destination_account=user_account,
            amount=Decimal("100000"),
        )
        response = client.get(TRANSACTIONS_URL)

        assert response.status_code == 200
        assert response.data["count"] == 1

    def test_user_cannot_see_unrelated_transactions(self, authenticated_client, second_account):
        client, _ = authenticated_client
        third_account = SavingsAccount.objects.create_account(
            user=UserFactory(), balance=Decimal("500000")
        )
        Transaction.objects.create_internal_transaction(
            source_account=second_account,
            destination_account=third_account,
            amount=Decimal("100000"),
        )
        response = client.get(TRANSACTIONS_URL)

        assert response.status_code == 200
        assert response.data["count"] == 0

    def test_superuser_can_list_all_transactions(self, api_client, second_account):
        superuser = UserFactory(is_superuser=True, is_staff=True)
        third_account = SavingsAccount.objects.create_account(
            user=UserFactory(), balance=Decimal("500000")
        )
        Transaction.objects.create_internal_transaction(
            source_account=second_account,
            destination_account=third_account,
            amount=Decimal("100000"),
        )
        api_client.force_authenticate(user=superuser)
        response = api_client.get(TRANSACTIONS_URL)

        assert response.status_code == 200
        assert response.data["count"] == 1


@pytest.mark.django_db
class TestTransactionSourceOwnership:
    def test_user_can_transfer_from_another_users_account(self, authenticated_client, second_account):
        client, _ = authenticated_client
        third_account = SavingsAccount.objects.create_account(
            user=UserFactory(), balance=Decimal("500000")
        )
        payload = {
            "source_account": second_account.id,
            "destination_account": third_account.id,
            "transaction_type": "INTERNAL",
            "amount": "100000.00",
        }
        response = client.post(TRANSACTIONS_URL, payload)

        assert response.status_code == 201
