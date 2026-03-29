from rest_framework import serializers


class CDTSimulatorSerializer(serializers.Serializer):
    capital = serializers.DecimalField(max_digits=15, decimal_places=2)
    term_days = serializers.IntegerField(min_value=1)

    def validate_capital(self, value):
        if value <= 0:
            raise serializers.ValidationError("Capital must be greater than zero.")
        return value


class LoanSimulatorSerializer(serializers.Serializer):
    principal = serializers.DecimalField(max_digits=15, decimal_places=2)
    term_months = serializers.IntegerField(min_value=1)

    def validate_principal(self, value):
        if value <= 0:
            raise serializers.ValidationError("Principal must be greater than zero.")
        return value
