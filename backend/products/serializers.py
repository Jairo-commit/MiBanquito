from rest_framework import serializers
from products.models import CDT, LoanRequest


class LoanRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanRequest
        fields = [
            "id",
            "user",
            "amount",
            "term_months",
            "monthly_rate",
            "status",
            "created_at",
            "reviewed_by",
            "reviewed_at",
        ]
        extra_kwargs = {
            "user": {"read_only": True},
            "status": {"read_only": True},
            "created_at": {"read_only": True},
            "reviewed_by": {"read_only": True},
            "reviewed_at": {"read_only": True},
        }


class CDTSerializer(serializers.ModelSerializer):
    class Meta:
        model = CDT
        fields = [
            "id",
            "user",
            "amount",
            "term_days",
            "annual_rate",
            "maturity_date",
            "status",
            "created_at",
        ]
        extra_kwargs = {
            "user": {"read_only": True},
            "status": {"read_only": True},
            "created_at": {"read_only": True},
        }
