import pytest
from rest_framework.test import APIClient
from landing.models import ContactMessage


@pytest.fixture
def api_client():
    return APIClient()


class TestLandingInfo:
    def test_info_endpoint_is_public(self, db, api_client):
        response = api_client.get("/api/landing/info/")
        assert response.status_code == 200

    def test_info_contains_required_keys(self, db, api_client):
        response = api_client.get("/api/landing/info/")
        assert "mission" in response.data
        assert "vision" in response.data
        assert "products" in response.data
        assert "contact" in response.data

    def test_products_list_is_not_empty(self, db, api_client):
        response = api_client.get("/api/landing/info/")
        assert len(response.data["products"]) > 0


class TestContactMessage:
    def test_submit_contact_message(self, db, api_client):
        response = api_client.post(
            "/api/landing/contact/",
            {
                "name": "Juan Pérez",
                "email": "juan@example.com",
                "message": "I need help with my account.",
            },
        )
        assert response.status_code == 201
        assert ContactMessage.objects.count() == 1

    def test_contact_endpoint_is_public(self, db, api_client):
        response = api_client.post(
            "/api/landing/contact/",
            {
                "name": "Test",
                "email": "test@example.com",
                "message": "Hello",
            },
        )
        assert response.status_code == 201

    def test_contact_with_missing_fields_fails(self, db, api_client):
        response = api_client.post(
            "/api/landing/contact/",
            {
                "name": "Test",
            },
        )
        assert response.status_code == 400
