from rest_framework import serializers
from accounts.models import SavingsAccount
from accounts.helpers import MIN_OPENING_BALANCE


class SavingsAccountSerializer(serializers.ModelSerializer):
    balance = serializers.DecimalField(max_digits=15, decimal_places=2, required=True)

    class Meta:
        model = SavingsAccount
        fields = ["id", "user", "account_number", "balance", "is_active", "created_at"]
        extra_kwargs = {
            "account_number": {"read_only": True},
            "user": {"read_only": True},
            "created_at": {"read_only": True},
        }

    def validate_balance(self, value):
        if value < MIN_OPENING_BALANCE:
            raise serializers.ValidationError(
                f"The minimum balance to open an account is ${MIN_OPENING_BALANCE:,.0f}."
            )
        return value

    def create(self, validated_data):
        validated_data.pop("is_active", None)
        return SavingsAccount.objects.create_account(**validated_data)
