from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from accounts.models import SavingsAccount
from accounts.helpers import validate_opening_balance


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
        try:
            validate_opening_balance(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value

    def create(self, validated_data):
        validated_data.pop("is_active", None)
        return SavingsAccount.objects.create_account(**validated_data)
