from rest_framework.routers import DefaultRouter
from accounts.views import SavingsAccountViewSet

router = DefaultRouter()
router.register("accounts", SavingsAccountViewSet, basename="accounts")

urlpatterns = router.urls
