import re
from django.core.exceptions import ValidationError


class BankPasswordValidator:
    MIN_LENGTH = 12

    def validate(self, password, user=None):
        failures = []
        if len(password) < self.MIN_LENGTH:
            failures.append(f"At least {self.MIN_LENGTH} characters.")
        if not re.search(r"[A-Z]", password):
            failures.append("At least one uppercase letter.")
        if not re.search(r"[a-z]", password):
            failures.append("At least one lowercase letter.")
        if not re.search(r"\d", password):
            failures.append("At least one digit.")
        if not re.search(r"[^A-Za-z0-9]", password):
            failures.append("At least one special character.")
        if failures:
            raise ValidationError(failures)

    def get_help_text(self):
        return (
            f"Password must be at least {self.MIN_LENGTH} characters and contain "
            "an uppercase letter, a lowercase letter, a digit, and a special character."
        )
