import uuid
from django.db import models


class Transaction(models.Model):
    TRANSACTION_TYPE_INTERNAL = "INTERNAL"
    TRANSACTION_TYPE_EXTERNAL = "EXTERNAL"

    TRANSACTION_TYPE_CHOICES = [
        (TRANSACTION_TYPE_INTERNAL, "Internal"),
        (TRANSACTION_TYPE_EXTERNAL, "External"),
    ]

    STATUS_PENDING = "PENDING"
    STATUS_COMPLETED = "COMPLETED"
    STATUS_FAILED = "FAILED"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_COMPLETED, "Completed"),
        (STATUS_FAILED, "Failed"),
    ]

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
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default=STATUS_PENDING
    )
    reference = models.UUIDField(unique=True, default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, blank=True)
