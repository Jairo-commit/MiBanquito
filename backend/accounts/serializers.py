from decimal import Decimal
from rest_framework import serializers
from accounts.models import AccountMovement, SavingsAccount


class SavingsAccountCreateSerializer(serializers.ModelSerializer):
    initial_deposit = serializers.DecimalField(
        max_digits=15,
        decimal_places=2,
        write_only=True,
    )

    class Meta:
        model = SavingsAccount
        fields = [
            "id",
            "account_number",
            "balance",
            "is_active",
            "created_at",
            "initial_deposit",
        ]
        read_only_fields = [
            "id",
            "account_number",
            "balance",
            "is_active",
            "created_at",
        ]

    def validate_initial_deposit(self, value):
        if value < Decimal("100000"):
            raise serializers.ValidationError(
                "Initial deposit must be at least 100,000."
            )
        return value


class SavingsAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavingsAccount
        fields = ["id", "account_number", "balance", "is_active", "created_at"]
        read_only_fields = [
            "id",
            "account_number",
            "balance",
            "is_active",
            "created_at",
        ]


class AccountMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountMovement
        fields = ["id", "movement_type", "amount", "description", "timestamp"]
        read_only_fields = ["id", "movement_type", "amount", "description", "timestamp"]
