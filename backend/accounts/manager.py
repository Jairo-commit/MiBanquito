import random
from decimal import Decimal
from django.db import models


def generate_account_number(model) -> str:
    """
    Receives the model class as a parameter to avoid circular imports.
    """
    max_attempts = 10
    for _ in range(max_attempts):
        candidate = "MB" + "".join([str(random.randint(0, 9)) for _ in range(10)])
        if not model.objects.filter(account_number=candidate).exists():
            return candidate
    raise RuntimeError("Failed to generate a unique account number after maximum attempts")


class SavingsAccountManager(models.Manager):

    def create_account(self, user, balance: Decimal, **kwargs):
        """
        Single entry point for account creation.
        - Validates opening balance
        - Generates a unique account number
        - Persists the account
        """
        from accounts.helpers import validate_opening_balance

        validate_opening_balance(balance)
        account = self.model(user=user, balance=balance, **kwargs)
        account.account_number = generate_account_number(self.model)
        account.save()
        return account