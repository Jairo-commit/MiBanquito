from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.views import CreateUserView, RetrieveCurrentUserView
from accounts.views import SavingsAccountViewSet 
from transactions.views import TransactionViewSet
from products.views import CDTViewSet, LoanRequestViewSet

router = DefaultRouter()
router.register("accounts", SavingsAccountViewSet, basename="accounts")
router.register("transactions", TransactionViewSet, basename="transactions")
router.register("products/loans", LoanRequestViewSet, basename="loans")
router.register("products/cdts", CDTViewSet, basename="cdts")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/user/me/", RetrieveCurrentUserView.as_view(), name="current-user"),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api-auth/", include("rest_framework.urls")),
]
