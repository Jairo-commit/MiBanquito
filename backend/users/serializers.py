from rest_framework import serializers
from users.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "document_type",
            "document_number",
            "full_name",
            "city",
            "phone",
            "is_superuser",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": True},
            "document_number": {"required": True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
