---
paths:
  - "backend/**/*.py"
---

# Python style

- **Format with black**: `docker compose exec backend black .`. flake8 allows lines up to 140 characters (`setup.cfg`) and skips migrations.
- **Everything is in English**: identifiers, comments, docstrings, error messages and choice labels. Colombian domain terms that are proper names (`Cédula de Ciudadanía`, `NIT`, `CDT`) are the exception.
- **Error messages are full sentences that tell the user what to fix**, and include the relevant value: `f"The minimum balance to open an account is ${MIN_OPENING_BALANCE:,.0f}."`
- **Type-annotate helper and manager signatures** (`amount: Decimal`, `-> None`, `-> str`).
- **Name validators `validate_<rule>`** and have them return `None` or raise; never return a boolean for the caller to check.
- **Group imports**: standard library, then Django and DRF, then the project's apps. Never import with `*`.
- **Configuration and secrets come from `backend/.env` via `django-environ`** in `core/settings.py`; never hard-code them.
