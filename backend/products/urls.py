from rest_framework.routers import DefaultRouter
from products.views import CDTViewSet, LoanRequestViewSet

router = DefaultRouter()
router.register("products/loans", LoanRequestViewSet, basename="loans")
router.register("products/cdts", CDTViewSet, basename="cdts")

urlpatterns = router.urls
