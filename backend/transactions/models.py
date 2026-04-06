import uuid
from django.db import models


class Transaction(models.Model):

    class TransactionType(models.TextChoices):
        INTERNAL = "INTERNAL", "Internal"
        EXTERNAL = "EXTERNAL", "External"

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        COMPLETED = "COMPLETED", "Completed"
        FAILED = "FAILED", "Failed"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    source_account = models.ForeignKey(
        "accounts.SavingsAccount",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="outgoing_transactions",
    )
    destination_account = models.ForeignKey(
        "accounts.SavingsAccount",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="incoming_transactions",
    )
    transaction_type = models.CharField(
        max_length=10,
        choices=TransactionType.choices
    )
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING
    )
    reference = models.UUIDField(unique=True, default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True)
