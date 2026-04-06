from rest_framework import viewsets
from products.models import CDT, LoanRequest
from products.serializers import CDTSerializer, LoanRequestSerializer
from simulators.services import fetch_current_rates


class LoanRequestViewSet(viewsets.ModelViewSet):
    serializer_class = LoanRequestSerializer

    def get_queryset(self):
        return LoanRequest.objects.filter(user=self.request.user).order_by(
            "-created_at"
        )

    def perform_create(self, serializer):
        rates = fetch_current_rates()
        serializer.save(user=self.request.user, monthly_rate=rates["loan_rate"])


class CDTViewSet(viewsets.ModelViewSet):
    serializer_class = CDTSerializer

    def get_queryset(self):
        return CDT.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        rates = fetch_current_rates()
        serializer.save(user=self.request.user, annual_rate=rates["cdt_rate"])
