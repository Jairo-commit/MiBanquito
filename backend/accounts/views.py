from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from accounts.models import SavingsAccount
from accounts.serializers import SavingsAccountSerializer


class SavingsAccountViewSet(viewsets.ModelViewSet):
    serializer_class = SavingsAccountSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return SavingsAccount.objects.all()
        return SavingsAccount.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
