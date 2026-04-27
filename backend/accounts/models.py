import random
import uuid
from django.conf import settings
from django.db import models


def generate_account_number():
    max_attempts = 10
    for _ in range(max_attempts):
        candidate = "MB" + "".join([str(random.randint(0, 9)) for _ in range(10)])
        if not SavingsAccount.objects.filter(account_number=candidate).exists():
            return candidate
    raise RuntimeError(
        "Failed to generate a unique account number after maximum attempts"
    )


class SavingsAccount(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="savings_accounts",
    )
    account_number = models.CharField(max_length=20, unique=True)
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.account_number:
            self.account_number = generate_account_number()
        super().save(*args, **kwargs)


class AccountMovement(models.Model):

    class MovementType(models.TextChoices):
        DEPOSIT = "DEPOSIT", "Deposit"
        WITHDRAWAL = "WITHDRAWAL", "Withdrawal"
        TRANSFER_IN = "TRANSFER_IN", "Transfer In"
        TRANSFER_OUT = "TRANSFER_OUT", "Transfer Out"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    account = models.ForeignKey(
        SavingsAccount,
        on_delete=models.CASCADE,
        related_name="movements",
    )
    movement_type = models.CharField(
        max_length=20,
        choices=MovementType.choices
    )
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    description = models.CharField(max_length=255, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
