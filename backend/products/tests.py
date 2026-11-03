import pytest
from decimal import Decimal
from django.urls import reverse
from rest_framework.test import APIClient
from users.factories import UserFactory
from products.models import CDT, LoanRequest

LOANS_URL = reverse("loans-list")
CDTS_URL = reverse("cdts-list")

VALID_LOAN_PAYLOAD = {
    "amount": "5000000.00",
    "term_months": 12,
    "monthly_rate": "0.0150",
}

VALID_CDT_PAYLOAD = {
    "amount": "2000000.00",
    "term_days": 180,
    "annual_rate": "0.0800",
    "maturity_date": "2027-01-01",
}


def loan_detail_url(loan_id):
    return reverse("loans-detail", args=[loan_id])


def cdt_detail_url(cdt_id):
    return reverse("cdts-detail", args=[cdt_id])


def create_loan(user, **overrides):
    fields = {"amount": Decimal("5000000"), "term_months": 12, "monthly_rate": Decimal("0.0150")}
    return LoanRequest.objects.create(user=user, **{**fields, **overrides})


def create_cdt(user, **overrides):
    fields = {
        "amount": Decimal("2000000"),
        "term_days": 180,
        "annual_rate": Decimal("0.0800"),
        "maturity_date": "2027-01-01",
    }
    return CDT.objects.create(user=user, **{**fields, **overrides})


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def authenticated_client(api_client):
    user = UserFactory()
    api_client.force_authenticate(user=user)
    return api_client, user


@pytest.mark.django_db
class TestCreateLoanRequest:
    def test_unauthenticated_user_cannot_create_loan(self, api_client):
        response = api_client.post(LOANS_URL, VALID_LOAN_PAYLOAD)

        assert response.status_code == 401

    def test_loan_is_owned_by_the_authenticated_user(self, authenticated_client):
        client, user = authenticated_client
        response = client.post(LOANS_URL, VALID_LOAN_PAYLOAD)

        assert response.status_code == 201
        assert LoanRequest.objects.get(pk=response.data["id"]).user == user

    def test_payload_cannot_assign_loan_to_another_user(self, authenticated_client):
        client, user = authenticated_client
        other_user = UserFactory()
        response = client.post(LOANS_URL, {**VALID_LOAN_PAYLOAD, "user": other_user.pk})

        assert response.status_code == 201
        assert LoanRequest.objects.get(pk=response.data["id"]).user == user

    def test_new_loan_is_pending_even_if_payload_sets_status(self, authenticated_client):
        client, _ = authenticated_client
        response = client.post(LOANS_URL, {**VALID_LOAN_PAYLOAD, "status": "APPROVED"})

        assert response.status_code == 201
        assert LoanRequest.objects.get(pk=response.data["id"]).status == LoanRequest.Status.PENDING


@pytest.mark.django_db
class TestLoanRequestVisibility:
    def test_user_lists_only_own_loans(self, authenticated_client):
        client, user = authenticated_client
        create_loan(user)
        create_loan(UserFactory())

        response = client.get(LOANS_URL)

        assert response.status_code == 200
        assert response.data["count"] == 1

    def test_another_users_loan_returns_404(self, authenticated_client):
        client, _ = authenticated_client
        other_loan = create_loan(UserFactory())

        response = client.get(loan_detail_url(other_loan.id))

        assert response.status_code == 404

    def test_superuser_lists_all_loans(self, api_client):
        create_loan(UserFactory())
        create_loan(UserFactory())
        api_client.force_authenticate(user=UserFactory(is_superuser=True))

        response = api_client.get(LOANS_URL)

        assert response.status_code == 200
        assert response.data["count"] == 2


@pytest.mark.django_db
class TestCreateCDT:
    def test_unauthenticated_user_cannot_create_cdt(self, api_client):
        response = api_client.post(CDTS_URL, VALID_CDT_PAYLOAD)

        assert response.status_code == 401

    def test_cdt_is_owned_by_the_authenticated_user(self, authenticated_client):
        client, user = authenticated_client
        response = client.post(CDTS_URL, VALID_CDT_PAYLOAD)

        assert response.status_code == 201
        assert CDT.objects.get(pk=response.data["id"]).user == user

    def test_new_cdt_is_active_even_if_payload_sets_status(self, authenticated_client):
        client, _ = authenticated_client
        response = client.post(CDTS_URL, {**VALID_CDT_PAYLOAD, "status": "MATURED"})

        assert response.status_code == 201
        assert CDT.objects.get(pk=response.data["id"]).status == CDT.Status.ACTIVE


@pytest.mark.django_db
class TestCDTVisibility:
    def test_user_lists_only_own_cdts(self, authenticated_client):
        client, user = authenticated_client
        create_cdt(user)
        create_cdt(UserFactory())

        response = client.get(CDTS_URL)

        assert response.status_code == 200
        assert response.data["count"] == 1

    def test_another_users_cdt_returns_404(self, authenticated_client):
        client, _ = authenticated_client
        other_cdt = create_cdt(UserFactory())

        response = client.get(cdt_detail_url(other_cdt.id))

        assert response.status_code == 404
