from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from accounts.models import AccountMovement, SavingsAccount
from accounts.serializers import AccountMovementSerializer, SavingsAccountSerializer


class SavingsAccountViewSet(viewsets.ModelViewSet):
    queryset = SavingsAccount.objects.all()
    serializer_class = SavingsAccountSerializer
    permission_classes = [IsAuthenticated]


class AccountMovementViewSet(viewsets.ModelViewSet):
    queryset = AccountMovement.objects.all()
    serializer_class = AccountMovementSerializer
    permission_classes = [IsAuthenticated]
