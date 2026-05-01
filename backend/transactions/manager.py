from decimal import Decimal
from django.db import models, transaction


class TransactionManager(models.Manager):

    def create_internal_transaction(
        self,
        source_account,
        destination_account,
        amount: Decimal,
        description: str = "",
    ):

        from transactions.helpers import (
            validate_transaction_amount,
            validate_source_account_active,
            validate_destination_account_active,
            validate_sufficient_funds,
            validate_different_accounts,
        )
        from accounts.models import SavingsAccount

        validate_transaction_amount(amount)
        validate_different_accounts(source_account, destination_account)
        validate_source_account_active(source_account)
        validate_destination_account_active(destination_account)
        validate_sufficient_funds(source_account, amount)

        try:
            with transaction.atomic():
                locked_source = SavingsAccount.objects.select_for_update().get(
                    pk=source_account.pk
                )
                locked_destination = SavingsAccount.objects.select_for_update().get(
                    pk=destination_account.pk
                )

                validate_sufficient_funds(locked_source, amount)

                locked_source.balance -= amount
                locked_destination.balance += amount
                locked_source.save(update_fields=["balance"])
                locked_destination.save(update_fields=["balance"])

                txn = self.model(
                    source_account=locked_source,
                    destination_account=locked_destination,
                    transaction_type=self.model.TransactionType.INTERNAL,
                    amount=amount,
                    status=self.model.Status.COMPLETED,
                    description=description,
                )
                txn.save()

        except Exception:
            txn = self.model(
                source_account=source_account,
                destination_account=destination_account,
                transaction_type=self.model.TransactionType.INTERNAL,
                amount=amount,
                status=self.model.Status.FAILED,
                description=description,
            )
            txn.save()
            raise

        return txn

    def create_external_transaction(
        self,
        source_account,
        amount: Decimal,
        description: str = "",
    ):
        
        from transactions.helpers import (
            validate_transaction_amount,
            validate_source_account_active,
            validate_sufficient_funds,
        )
        from accounts.models import SavingsAccount

        validate_transaction_amount(amount)
        validate_source_account_active(source_account)
        validate_sufficient_funds(source_account, amount)

        try:
            with transaction.atomic():
                locked_source = SavingsAccount.objects.select_for_update().get(
                    pk=source_account.pk
                )

                validate_sufficient_funds(locked_source, amount)

                locked_source.balance -= amount
                locked_source.save(update_fields=["balance"])

                txn = self.model(
                    source_account=locked_source,
                    destination_account=None,
                    transaction_type=self.model.TransactionType.EXTERNAL,
                    amount=amount,
                    status=self.model.Status.COMPLETED,
                    description=description,
                )
                txn.save()

        except Exception:
            txn = self.model(
                source_account=source_account,
                destination_account=None,
                transaction_type=self.model.TransactionType.EXTERNAL,
                amount=amount,
                status=self.model.Status.FAILED,
                description=description,
            )
            txn.save()
            raise

        return txn