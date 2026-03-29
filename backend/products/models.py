import uuid

from django.conf import settings
from django.db import models


class LoanRequest(models.Model):
    STATUS_PENDING = "PENDING"
    STATUS_APPROVED = "APPROVED"
    STATUS_REJECTED = "REJECTED"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_APPROVED, "Approved"),
        (STATUS_REJECTED, "Rejected"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="loan_requests",
    )
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    term_months = models.PositiveIntegerField()
    monthly_rate = models.DecimalField(max_digits=5, decimal_places=4)
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default=STATUS_PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="reviewed_loans",
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)


class CDT(models.Model):
    STATUS_ACTIVE = "ACTIVE"
    STATUS_MATURED = "MATURED"

    STATUS_CHOICES = [
        (STATUS_ACTIVE, "Active"),
        (STATUS_MATURED, "Matured"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cdts",
    )
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    term_days = models.PositiveIntegerField()
    annual_rate = models.DecimalField(max_digits=5, decimal_places=4)
    maturity_date = models.DateField()
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default=STATUS_ACTIVE
    )
    created_at = models.DateTimeField(auto_now_add=True)
