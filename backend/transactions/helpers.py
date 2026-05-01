from decimal import Decimal
from django.core.exceptions import ValidationError

MIN_TRANSACTION_AMOUNT = Decimal("0.01")


def validate_transaction_amount(amount: Decimal) -> None:
    if amount < MIN_TRANSACTION_AMOUNT:
        raise ValidationError(
            f"The transaction amount must be at least ${MIN_TRANSACTION_AMOUNT}."
        )


def validate_source_account_active(account) -> None:
    if not account.is_active:
        raise ValidationError(
            f"Source account {account.account_number} is inactive and cannot perform transactions."
        )


def validate_destination_account_active(account) -> None:
    if not account.is_active:
        raise ValidationError(
            f"Destination account {account.account_number} is inactive and cannot receive transactions."
        )


def validate_sufficient_funds(account, amount: Decimal) -> None:
    if account.balance < amount:
        raise ValidationError(
            f"Insufficient funds. Available balance: ${account.balance:,.2f}, "
            f"requested amount: ${amount:,.2f}."
        )


def validate_different_accounts(source_account, destination_account) -> None:
    if source_account == destination_account:
        raise ValidationError("Source and destination accounts must be different.")


def validate_internal_transaction_fields(source_account, destination_account) -> None:
    if not source_account:
        raise ValidationError({"source_account": "This field is required for INTERNAL transactions."})
    if not destination_account:
        raise ValidationError({"destination_account": "This field is required for INTERNAL transactions."})


def validate_external_transaction_fields(source_account) -> None:
    if not source_account:
        raise ValidationError({"source_account": "This field is required for EXTERNAL transactions."})