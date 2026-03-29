from rest_framework.routers import DefaultRouter
from users.views import AuthViewSet, UserViewSet

router = DefaultRouter()
router.register("users", UserViewSet, basename="users")
router.register("auth", AuthViewSet, basename="auth")

urlpatterns = router.urls
