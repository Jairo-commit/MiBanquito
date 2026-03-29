from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from simulators.serializers import CDTSimulatorSerializer, LoanSimulatorSerializer
from simulators.services import calculate_cdt, calculate_loan_quota, fetch_current_rates


class SimulatorViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=["post"])
    def cdt(self, request):
        serializer = CDTSimulatorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        rates = fetch_current_rates()
        cdt_rate = rates["cdt_rate"]
        interest = calculate_cdt(data["capital"], cdt_rate, data["term_days"])
        return Response(
            {
                "capital": data["capital"],
                "term_days": data["term_days"],
                "annual_rate": cdt_rate,
                "interest": interest,
                "total": data["capital"] + interest,
            }
        )

    @action(detail=False, methods=["post"])
    def loan(self, request):
        serializer = LoanSimulatorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        rates = fetch_current_rates()
        loan_rate = rates["loan_rate"]
        monthly_quota = calculate_loan_quota(
            data["principal"], loan_rate, data["term_months"]
        )
        return Response(
            {
                "principal": data["principal"],
                "term_months": data["term_months"],
                "monthly_rate": loan_rate,
                "monthly_quota": monthly_quota,
                "total_payment": monthly_quota * data["term_months"],
            }
        )
