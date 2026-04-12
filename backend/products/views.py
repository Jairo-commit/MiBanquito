from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from products.models import CDT, LoanRequest
from products.serializers import CDTSerializer, LoanRequestSerializer


class LoanRequestViewSet(viewsets.ModelViewSet):
    queryset = LoanRequest.objects.all()
    serializer_class = LoanRequestSerializer
    permission_classes = [IsAuthenticated]


class CDTViewSet(viewsets.ModelViewSet):
    queryset = CDT.objects.all()
    serializer_class = CDTSerializer
    permission_classes = [IsAuthenticated]
