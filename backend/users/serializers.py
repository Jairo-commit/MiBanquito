from rest_framework import serializers
from users.models import User


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "document_type",
            "document_number",
            "email",
            "full_name",
            "city",
            "phone",
            "password",
            "password_confirm",
            "username",
        ]

    def validate(self, data):
        if data["password"] != data["password_confirm"]:
            raise serializers.ValidationError(
                {"password_confirm": "Passwords do not match."}
            )
        return data

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")
        user = User.objects.create_user(
            username=validated_data.pop("username"), password=password, **validated_data
        )
        return user


class LoginSerializer(serializers.Serializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "password",
        ]
