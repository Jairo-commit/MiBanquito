from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from landing.models import ContactMessage
from landing.serializers import ContactMessageSerializer


class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAuthenticated]
