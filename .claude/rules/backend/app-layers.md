---
paths:
  - "backend/**/*.py"
---

# Each app splits its logic into fixed layers

- **Every Django app keeps the same files, each with one job.** Put new code in the layer that owns it, not where it is first needed.
  - `models.py`: fields, choices, `__str__`. No business rules.
  - `manager.py`: the only place that creates records with side effects (balances, generated numbers, linked rows), as `create_<thing>()` methods.
  - `helpers.py`: module-level constants (`MIN_OPENING_BALANCE`) and pure `validate_<rule>()` functions that raise Django's `ValidationError`.
  - `serializers.py`: input shape, field-level validation and the translation of Django errors to DRF errors.
  - `views.py`: permissions, queryset scoping and request-bound data (`request.user`).
  - `factories.py`: `factory_boy` factories for tests.
- **A serializer's `create()` delegates to the manager; it never moves money or generates values itself.**
  - Bad: `account = SavingsAccount(**validated_data); account.account_number = ...; account.save()` inside the serializer.
  - Good: `return SavingsAccount.objects.create_account(**validated_data)`
- **A business rule lives once, in `helpers.py`, and every layer calls it.** The manager calls the validator so the rule holds outside the API too (admin, shell, scripts); the serializer calls the same validator to return a 400 early. Never retype the rule's condition or its message in a second place.
  - Bad: `if value < MIN_OPENING_BALANCE: raise serializers.ValidationError("The minimum balance ...")` copied into `validate_balance`.
  - Good: `validate_amount` in `transactions/serializers.py`, which calls `validate_transaction_amount` and re-raises.
- **Import across apps through the owning app's module.** Use `from accounts.models import SavingsAccount`; in a `ForeignKey`, refer to another app's model by string (`"accounts.SavingsAccount"`) and to the user by `settings.AUTH_USER_MODEL`.
- **References**: `accounts/` (manager + helper + serializer), `transactions/manager.py`, `transactions/helpers.py`.
