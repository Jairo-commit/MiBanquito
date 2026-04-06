import pytest
from decimal import Decimal
from datetime import date, timedelta
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from products.models import CDT, LoanRequest

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


class TestLoanRequestViews:
    def test_create_loan_request(self, db, authenticated_client):
        response = authenticated_client.post(
            "/api/products/loans/",
            {
                "amount": "5000000",
                "term_months": "24",
                "monthly_rate": "0.0150",
            },
        )
        assert response.status_code == 201
        assert LoanRequest.objects.count() == 1

    def test_loan_request_defaults_to_pending(self, db, authenticated_client):
        authenticated_client.post(
            "/api/products/loans/",
            {
                "amount": "5000000",
                "term_months": "24",
                "monthly_rate": "0.0150",
            },
        )
        loan = LoanRequest.objects.first()
        assert loan.status == LoanRequest.STATUS_PENDING

    def test_list_only_user_loans(self, db, authenticated_client, user):
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
        LoanRequest.objects.create(
            user=other_user,
            amount=Decimal("1000000"),
            term_months=12,
            monthly_rate=Decimal("0.0150"),
        )
        LoanRequest.objects.create(
            user=user,
            amount=Decimal("2000000"),
            term_months=6,
            monthly_rate=Decimal("0.0150"),
        )
        response = authenticated_client.get("/api/products/loans/")
        assert response.status_code == 200
        assert response.data["count"] == 1

    def test_put_and_patch_not_allowed(self, db, authenticated_client):
        authenticated_client.post(
            "/api/products/loans/",
            {
                "amount": "5000000",
                "term_months": "24",
                "monthly_rate": "0.0150",
            },
        )
        loan = LoanRequest.objects.first()
        patch_response = authenticated_client.patch(
            f"/api/products/loans/{loan.id}/", {"amount": "9000000"}
        )
        assert patch_response.status_code == 405


class TestCDTViews:
    def test_create_cdt_sets_maturity_date(self, db, authenticated_client):
        response = authenticated_client.post(
            "/api/products/cdts/",
            {
                "amount": "3000000",
                "term_days": "90",
                "annual_rate": "0.1200",
            },
        )
        assert response.status_code == 201
        cdt = CDT.objects.first()
        expected_maturity = date.today() + timedelta(days=90)
        assert cdt.maturity_date == expected_maturity

    def test_cdt_defaults_to_active_status(self, db, authenticated_client):
        authenticated_client.post(
            "/api/products/cdts/",
            {
                "amount": "3000000",
                "term_days": "90",
                "annual_rate": "0.1200",
            },
        )
        cdt = CDT.objects.first()
        assert cdt.status == CDT.STATUS_ACTIVE
