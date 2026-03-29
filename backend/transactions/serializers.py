from rest_framework import serializers
from transactions.models import Transaction


class TransferSerializer(serializers.Serializer):
    source_account_id = serializers.UUIDField()
    destination_account_id = serializers.UUIDField()
    amount = serializers.DecimalField(max_digits=15, decimal_places=2)
    description = serializers.CharField(max_length=255, required=False, default="")

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Transfer amount must be greater than zero."
            )
        return value


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            "id",
            "source_account",
            "destination_account",
            "transaction_type",
            "amount",
            "status",
            "reference",
            "created_at",
            "description",
        ]
        read_only_fields = fields
