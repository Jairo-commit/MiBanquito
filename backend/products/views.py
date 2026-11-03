from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from products.models import CDT, LoanRequest
from products.serializers import CDTSerializer, LoanRequestSerializer


class LoanRequestViewSet(viewsets.ModelViewSet):
    serializer_class = LoanRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return LoanRequest.objects.all()
        return LoanRequest.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CDTViewSet(viewsets.ModelViewSet):
    serializer_class = CDTSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return CDT.objects.all()
        return CDT.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
