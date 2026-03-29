import pytest
from decimal import Decimal
from rest_framework.test import APIClient
from simulators.services import calculate_cdt, calculate_loan_quota, fetch_current_rates


@pytest.fixture
def api_client():
    return APIClient()


class TestCalculateCdt:
    def test_calculates_interest_correctly(self):
        capital = Decimal("1000000")
        rate = Decimal("0.12")
        days = 365
        interest = calculate_cdt(capital, rate, days)
        assert interest == Decimal("120000.00")

    def test_short_term_cdt(self):
        capital = Decimal("1000000")
        rate = Decimal("0.12")
        days = 180
        interest = calculate_cdt(capital, rate, days)
        assert interest > Decimal("0")
        assert interest < Decimal("120000")


class TestCalculateLoanQuota:
    def test_calculates_monthly_quota(self):
        principal = Decimal("1000000")
        monthly_rate = Decimal("0.015")
        term_months = 12
        quota = calculate_loan_quota(principal, monthly_rate, term_months)
        assert quota > Decimal("0")
        assert isinstance(quota, Decimal)

    def test_longer_term_results_in_lower_quota(self):
        principal = Decimal("1000000")
        rate = Decimal("0.015")
        quota_12 = calculate_loan_quota(principal, rate, 12)
        quota_24 = calculate_loan_quota(principal, rate, 24)
        assert quota_24 < quota_12


class TestFetchCurrentRates:
    def test_returns_defaults_when_api_fails(self, mocker):
        mocker.patch(
            "simulators.services.requests.get", side_effect=Exception("Network error")
        )
        rates = fetch_current_rates()
        assert rates["cdt_rate"] == Decimal("0.12")
        assert rates["loan_rate"] == Decimal("0.015")

    def test_returns_defaults_on_bad_response(self, mocker):
        mock_response = mocker.Mock()
        mock_response.raise_for_status.side_effect = Exception("HTTP error")
        mocker.patch("simulators.services.requests.get", return_value=mock_response)
        rates = fetch_current_rates()
        assert "cdt_rate" in rates
        assert "loan_rate" in rates


class TestSimulatorEndpoints:
    def test_cdt_simulator_returns_result(self, db, api_client, mocker):
        mocker.patch(
            "simulators.services.requests.get",
            side_effect=Exception("Network error"),
        )
        response = api_client.post(
            "/api/simulators/cdt/",
            {
                "capital": "1000000",
                "term_days": "365",
            },
        )
        assert response.status_code == 200
        assert "interest" in response.data
        assert "total" in response.data

    def test_loan_simulator_returns_result(self, db, api_client, mocker):
        mocker.patch(
            "simulators.services.requests.get",
            side_effect=Exception("Network error"),
        )
        response = api_client.post(
            "/api/simulators/loan/",
            {
                "principal": "5000000",
                "term_months": "12",
            },
        )
        assert response.status_code == 200
        assert "monthly_quota" in response.data

    def test_cdt_simulator_with_invalid_capital_fails(self, db, api_client):
        response = api_client.post(
            "/api/simulators/cdt/",
            {
                "capital": "-1000",
                "term_days": "365",
            },
        )
        assert response.status_code == 400

    def test_simulators_are_public(self, db, api_client, mocker):
        mocker.patch(
            "simulators.services.requests.get",
            side_effect=Exception("Network error"),
        )
        response = api_client.post(
            "/api/simulators/cdt/",
            {
                "capital": "1000000",
                "term_days": "30",
            },
        )
        assert response.status_code == 200
