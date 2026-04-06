from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from users.models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        (
            "Banking profile",
            {
                "fields": (
                    "document_type",
                    "document_number",
                    "full_name",
                    "city",
                    "phone",
                )
            },
        ),
    )
