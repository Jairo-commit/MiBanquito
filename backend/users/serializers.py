import uuid

from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from users.models import User


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "document_type",
            "document_number",
            "full_name",
            "city",
            "phone",
            "email",
            "occupation",
            "password",
            "password_confirm",
        ]

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate(self, data):
        if data["password"] != data["password_confirm"]:
            raise serializers.ValidationError(
                {"password_confirm": "Passwords do not match."}
            )
        return data

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")
        validated_data["username"] = uuid.uuid4().hex
        user = User.objects.create_user(
            username=validated_data.pop("username"), password=password, **validated_data
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "document_type",
            "document_number",
            "full_name",
            "city",
            "phone",
            "email",
            "occupation",
        ]
        read_only_fields = ["id", "document_type", "document_number", "email"]
