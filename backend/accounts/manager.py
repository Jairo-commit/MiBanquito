from decimal import Decimal
from django.db import models
import secrets


def generate_account_number(model) -> str:
    max_attempts = 10
    for _ in range(max_attempts):
        candidate = "MB" + "".join([str(secrets.randbelow(10)) for _ in range(10)])
        if not model.objects.filter(account_number=candidate).exists():
            return candidate
    raise RuntimeError("Failed to generate a unique account number after maximum attempts")


class SavingsAccountManager(models.Manager):

    def create_account(self, user, balance: Decimal, **kwargs):

        from accounts.helpers import validate_opening_balance

        validate_opening_balance(balance)
        account = self.model(user=user, balance=balance, **kwargs)
        account.account_number = generate_account_number(self.model)
        account.save()
        return account
