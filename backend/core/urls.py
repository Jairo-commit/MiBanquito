from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from users.views import AuthViewSet, UserViewSet
from accounts.views import SavingsAccountViewSet
from transactions.views import TransactionViewSet
from products.views import LoanRequestViewSet, CDTViewSet
from simulators.views import SimulatorViewSet
from landing.views import LandingViewSet

router = DefaultRouter()

router.register("users", UserViewSet, basename="users")
router.register("auth", AuthViewSet, basename="auth")
router.register("accounts", SavingsAccountViewSet, basename="accounts")
router.register("transactions", TransactionViewSet, basename="transactions")
router.register("products/loans", LoanRequestViewSet, basename="loans")
router.register("products/cdts", CDTViewSet, basename="cdts")
router.register("simulators", SimulatorViewSet, basename="simulators")
router.register("landing", LandingViewSet, basename="landing")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
]
