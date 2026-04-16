from rest_framework import serializers
from accounts.models import AccountMovement, SavingsAccount


class SavingsAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavingsAccount
        fields = [
            "id",
            "user",
            "account_number",
            "balance",
            "is_active",
            "created_at",
        ]
        extra_kwargs = {
            "account_number": {"read_only": True},
        }


class AccountMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountMovement
        fields = [
            "id",
            "account",
            "movement_type",
            "amount",
            "description",
            "timestamp",
        ]
