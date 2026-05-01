from django.db.models import Q
from rest_framework import mixins, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from transactions.models import Transaction
from transactions.serializers import TransactionSerializer


class TransactionViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Transaction.objects.all()
        return Transaction.objects.filter(
            Q(source_account__user=user) | Q(destination_account__user=user)
        )

    def perform_create(self, serializer):
        source_account = serializer.validated_data.get("source_account")
        if source_account and source_account.user != self.request.user:
            raise PermissionDenied("You can only transfer from your own accounts.")
        serializer.save()
