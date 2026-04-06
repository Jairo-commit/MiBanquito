from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    class DocumentType(models.TextChoices):
        CC = "CC", "Cédula de Ciudadanía"
        CE = "CE", "Cédula de Extranjería"
        NIT = "NIT", "NIT"
        PP = "PP", "Passport"

    document_type = models.CharField(
        max_length=10,
        choices=DocumentType.choices
    )
    document_number = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(unique=True)
