from django.db.models import Q
from rest_framework import mixins, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from transactions.models import Transaction
from transactions.serializers import TransactionSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Transaction.objects.all()
        return Transaction.objects.filter(
            Q(source_account__user=user) | Q(destination_account__user=user)
        ).distinct()
    
    
    def perform_create(self, serializer):
        user = self.request.user
        source_account = serializer.validated_data.get("source_account")

        if source_account and source_account.user != user:
            raise PermissionDenied(
                "You do not have permission to transfer from this account."
            )

        serializer.save()


    def destroy(self, request, *args, **kwargs):
        raise PermissionDenied("Transactions cannot be deleted.")
