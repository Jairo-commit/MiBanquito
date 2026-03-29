from rest_framework.routers import DefaultRouter
from landing.views import LandingViewSet

router = DefaultRouter()
router.register("landing", LandingViewSet, basename="landing")

urlpatterns = router.urls
