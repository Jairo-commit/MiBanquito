---
paths:
  - "backend/**/models.py"
  - "backend/**/migrations/**/*.py"
---

# Model conventions

- **Choices are a nested `models.TextChoices` class**, named for what it classifies (`Status`, `TransactionType`, `DocumentType`), and code compares against the member, never the raw string.
  - Bad: `STATUS_PENDING = "PENDING"` plus a `STATUS_CHOICES` list; `if txn.status == "COMPLETED"`.
  - Good: `class Status(models.TextChoices): PENDING = "PENDING", "Pending"`; `self.model.Status.COMPLETED`.
- **Records that are exposed through the API or referenced externally use a UUID primary key**: `id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)`.
- **Every `ForeignKey` sets an explicit `related_name`** that reads from the other side (`savings_accounts`, `outgoing_transactions`, `reviewed_loans`).
- **Every model has `created_at = models.DateTimeField(auto_now_add=True)`.**
- **Pick `on_delete` by ownership.** `CASCADE` from the owner (a user's accounts, loans, CDTs); `SET_NULL` with `null=True, blank=True` for history that must outlive the row it points to (a transaction's accounts, a loan's reviewer).
- **Attach a custom manager as `objects = <Model>Manager()`** declared as the model's first attribute.
- **Define `__str__`** so the admin and logs show something readable.
- **Never edit an applied migration.** Generate a new one with `docker compose exec backend python manage.py makemigrations`.
