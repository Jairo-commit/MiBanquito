from rest_framework import serializers
from transactions.models import Transaction


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
