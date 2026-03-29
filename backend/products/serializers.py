from datetime import timedelta

from django.utils import timezone
from rest_framework import serializers
from products.models import CDT, LoanRequest


class LoanRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanRequest
        fields = [
            "id",
            "amount",
            "term_months",
            "monthly_rate",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "monthly_rate", "status", "created_at"]


class CDTSerializer(serializers.ModelSerializer):
    class Meta:
        model = CDT
        fields = [
            "id",
            "amount",
            "term_days",
            "annual_rate",
            "maturity_date",
            "status",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "annual_rate",
            "maturity_date",
            "status",
            "created_at",
        ]

    def create(self, validated_data):
        term_days = validated_data["term_days"]
        validated_data["maturity_date"] = timezone.now().date() + timedelta(
            days=term_days
        )
        return super().create(validated_data)
