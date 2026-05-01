from decimal import Decimal
from django.core.exceptions import ValidationError

MIN_OPENING_BALANCE = Decimal("100000")


def validate_opening_balance(value: Decimal) -> None:
    if value < MIN_OPENING_BALANCE:
        raise ValidationError(
            f"The minimum balance to open an account is ${MIN_OPENING_BALANCE:,.0f}."
        )
