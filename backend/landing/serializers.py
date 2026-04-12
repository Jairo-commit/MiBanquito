from rest_framework import serializers
from landing.models import ContactMessage


class ContactMessageSerializer(serializers.Serializer):
    class Meta:
        model = ContactMessage
        fields = [
            "id",
            "name",
            "email",
            "message",
            "created_at",
        ]
