from django.conf import settings
from django.db import models
from accounts.manager import SavingsAccountManager


class SavingsAccount(models.Model):
    objects = SavingsAccountManager()

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="savings_accounts",
    )
    account_number = models.CharField(max_length=20, unique=True)
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.account_number} — {self.user}"


