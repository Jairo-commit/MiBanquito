import logging
import uuid

from django.db import transaction as db_transaction
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from accounts.models import AccountMovement, SavingsAccount
from transactions.models import Transaction
from transactions.serializers import TransactionSerializer, TransferSerializer

logger = logging.getLogger(__name__)


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all().order_by("-created_at")
    serializer_class = TransactionSerializer
    pagination_class = PageNumberPagination

    @action(detail=False, methods=["post"])
    def transfer(self, request):
        serializer = TransferSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        source_id = data["source_account_id"]
        destination_id = data["destination_account_id"]
        amount = data["amount"]
        description = data["description"]
        transfer_reference = uuid.uuid4()
        try:
            with db_transaction.atomic():
                accounts = (
                    SavingsAccount.objects.select_for_update()
                    .filter(id__in=[source_id, destination_id])
                    .order_by("id")
                )
                accounts_by_id = {str(account.id): account for account in accounts}
                if len(accounts_by_id) < 2:
                    return Response(
                        {"detail": "One or both accounts not found."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                source_account = accounts_by_id[str(source_id)]
                destination_account = accounts_by_id[str(destination_id)]
                if source_account.user != request.user:
                    return Response(
                        {
                            "detail": (
                                "Source account not found or does not belong to you."
                            )
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )
                if source_account.balance < amount:
                    return Response(
                        {"detail": "Insufficient balance."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                source_account.balance -= amount
                destination_account.balance += amount
                source_account.save()
                destination_account.save()
                AccountMovement.objects.create(
                    account=source_account,
                    movement_type=AccountMovement.MOVEMENT_TRANSFER_OUT,
                    amount=amount,
                    description=description,
                )
                AccountMovement.objects.create(
                    account=destination_account,
                    movement_type=AccountMovement.MOVEMENT_TRANSFER_IN,
                    amount=amount,
                    description=description,
                )
                transaction = Transaction.objects.create(
                    source_account=source_account,
                    destination_account=destination_account,
                    transaction_type=Transaction.TRANSACTION_TYPE_INTERNAL,
                    amount=amount,
                    status=Transaction.STATUS_COMPLETED,
                    description=description,
                )
        except Exception:
            logger.exception("Transfer failed for reference %s", transfer_reference)
            return Response(
                {"detail": "Transfer failed due to an internal error."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        result_serializer = TransactionSerializer(transaction)
        return Response(result_serializer.data, status=status.HTTP_201_CREATED)
