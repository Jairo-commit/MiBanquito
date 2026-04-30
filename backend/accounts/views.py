from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from accounts.models import SavingsAccount
from accounts.serializers import SavingsAccountSerializer


class SavingsAccountViewSet(viewsets.ModelViewSet):
    queryset = SavingsAccount.objects.all()
    serializer_class = SavingsAccountSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


def create(self, validated_data):
    return SavingsAccount.objects.create_account(**validated_data)