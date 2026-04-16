from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from users.views import CreateUserView
from accounts.views import AccountMovementViewSet, SavingsAccountViewSet
from transactions.views import TransactionViewSet
from products.views import CDTViewSet, LoanRequestViewSet
from landing.views import ContactMessageViewSet

router = DefaultRouter()
router.register("accounts", SavingsAccountViewSet, basename="accounts")
router.register("account-movements", AccountMovementViewSet, basename="account-movements")
router.register("transactions", TransactionViewSet, basename="transactions")
router.register("products/loans", LoanRequestViewSet, basename="loans")
router.register("products/cdts", CDTViewSet, basename="cdts")
router.register("contact-messages", ContactMessageViewSet, basename="contact-messages")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api-auth/", include("rest_framework.urls")),
]
