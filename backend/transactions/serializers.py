from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from rest_framework.exceptions import ValidationError as DRFValidationError
from accounts.models import SavingsAccount
from transactions.models import Transaction
from transactions.helpers import (
    validate_transaction_amount,
    validate_internal_transaction_fields,
    validate_external_transaction_fields,
)


class TransactionSerializer(serializers.ModelSerializer):
    source_account_number = serializers.SerializerMethodField()
    source_account_holder = serializers.SerializerMethodField()
    destination_account_number = serializers.SerializerMethodField()
    destination_account_holder = serializers.SerializerMethodField()
    to_account_number = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Transaction
        fields = [
            "id",
            "source_account",
            "destination_account",
            "source_account_number",
            "source_account_holder",
            "destination_account_number",
            "destination_account_holder",
            "to_account_number",
            "transaction_type",
            "amount",
            "status",
            "reference",
            "created_at",
            "description",
        ]
        extra_kwargs = {
            "status": {"read_only": True},
            "reference": {"read_only": True},
            "created_at": {"read_only": True},
            "destination_account": {"required": False},
        }

    def get_source_account_number(self, obj):
        return obj.source_account.account_number if obj.source_account else None

    def get_source_account_holder(self, obj):
        if obj.source_account and obj.source_account.user:
            return obj.source_account.user.get_full_name()
        return None

    def get_destination_account_number(self, obj):
        return obj.destination_account.account_number if obj.destination_account else None

    def get_destination_account_holder(self, obj):
        if obj.destination_account and obj.destination_account.user:
            return obj.destination_account.user.get_full_name()
        return None

    def validate_amount(self, value):
        try:
            validate_transaction_amount(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.message)
        return value

    def validate(self, attrs):
        to_account_number = attrs.pop("to_account_number", None)
        transaction_type = attrs.get("transaction_type")
        source_account = attrs.get("source_account")

        if to_account_number:
            try:
                attrs["destination_account"] = SavingsAccount.objects.get(
                    account_number=to_account_number
                )
            except SavingsAccount.DoesNotExist:
                raise DRFValidationError({"to_account_number": "No account found with that number."})

        destination_account = attrs.get("destination_account")

        try:
            if transaction_type == Transaction.TransactionType.INTERNAL:
                validate_internal_transaction_fields(source_account, destination_account)
            else:
                validate_external_transaction_fields(source_account)
        except DjangoValidationError as e:
            raise DRFValidationError(e.message_dict)

        return attrs

    def create(self, validated_data):
        transaction_type = validated_data.get("transaction_type")

        try:
            if transaction_type == Transaction.TransactionType.INTERNAL:
                return Transaction.objects.create_internal_transaction(
                    source_account=validated_data["source_account"],
                    destination_account=validated_data["destination_account"],
                    amount=validated_data["amount"],
                    description=validated_data.get("description", ""),
                )
            return Transaction.objects.create_external_transaction(
                source_account=validated_data["source_account"],
                amount=validated_data["amount"],
                description=validated_data.get("description", ""),
            )

        except DjangoValidationError as e:
            raise DRFValidationError({"detail": e.message})
