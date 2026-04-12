from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from users.views import UserViewSet
from accounts.views import AccountMovementViewSet, SavingsAccountViewSet
from transactions.views import TransactionViewSet
from products.views import CDTViewSet, LoanRequestViewSet
from landing.views import ContactMessageViewSet

router = DefaultRouter()
router.register("users", UserViewSet, basename="users")
router.register("accounts", SavingsAccountViewSet, basename="accounts")
router.register("account-movements", AccountMovementViewSet, basename="account-movements")
router.register("transactions", TransactionViewSet, basename="transactions")
router.register("products/loans", LoanRequestViewSet, basename="loans")
router.register("products/cdts", CDTViewSet, basename="cdts")
router.register("contact-messages", ContactMessageViewSet, basename="contact-messages")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api-auth/", include("rest_framework.urls")),
]
