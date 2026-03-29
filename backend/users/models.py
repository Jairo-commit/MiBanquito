from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    DOCUMENT_TYPE_CC = "CC"
    DOCUMENT_TYPE_CE = "CE"
    DOCUMENT_TYPE_NIT = "NIT"
    DOCUMENT_TYPE_PP = "PP"

    DOCUMENT_TYPE_CHOICES = [
        (DOCUMENT_TYPE_CC, "Cédula de Ciudadanía"),
        (DOCUMENT_TYPE_CE, "Cédula de Extranjería"),
        (DOCUMENT_TYPE_NIT, "NIT"),
        (DOCUMENT_TYPE_PP, "Pasaporte"),
    ]

    OCCUPATION_INDEPENDENT = "INDEPENDENT"
    OCCUPATION_EMPLOYEE = "EMPLOYEE"

    OCCUPATION_CHOICES = [
        (OCCUPATION_INDEPENDENT, "Independent"),
        (OCCUPATION_EMPLOYEE, "Employee"),
    ]

    document_type = models.CharField(max_length=10, choices=DOCUMENT_TYPE_CHOICES)
    document_number = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    occupation = models.CharField(max_length=20, choices=OCCUPATION_CHOICES)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "document_type", "document_number", "full_name"]
