from rest_framework import serializers
from users.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "document_type",
            "document_number",
            "full_name",
            "city",
            "phone",
        ]
