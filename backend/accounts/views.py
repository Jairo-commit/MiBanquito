from django.db import transaction as db_transaction
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from accounts.models import AccountMovement, SavingsAccount
from accounts.serializers import (
    AccountMovementSerializer,
    SavingsAccountCreateSerializer,
    SavingsAccountSerializer,
)


class SavingsAccountViewSet(viewsets.ModelViewSet):
    http_method_names = ["get", "post", "head", "options"]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SavingsAccount.objects.filter(user=self.request.user).order_by(
            "-created_at"
        )

    def get_serializer_class(self):
        if self.action == "create":
            return SavingsAccountCreateSerializer
        return SavingsAccountSerializer

    def perform_create(self, serializer):
        initial_deposit = serializer.validated_data.pop("initial_deposit")
        with db_transaction.atomic():
            account = serializer.save(user=self.request.user, balance=initial_deposit)
            AccountMovement.objects.create(
                account=account,
                movement_type=AccountMovement.MOVEMENT_DEPOSIT,
                amount=initial_deposit,
                description="Apertura de cuenta",
            )

    @action(detail=True, methods=["get"])
    def movements(self, request, pk=None):
        account = self.get_object()
        movements = account.movements.order_by("-timestamp")
        page = self.paginate_queryset(movements)
        if page is not None:
            serializer = AccountMovementSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = AccountMovementSerializer(movements, many=True)
        return Response(serializer.data)
