from rest_framework.routers import DefaultRouter
from simulators.views import SimulatorViewSet

router = DefaultRouter()
router.register("simulators", SimulatorViewSet, basename="simulators")

urlpatterns = router.urls
