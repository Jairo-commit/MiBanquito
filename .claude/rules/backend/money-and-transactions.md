---
paths:
  - "backend/accounts/**/*.py"
  - "backend/transactions/**/*.py"
  - "backend/products/**/*.py"
---

# Money is moved atomically, with Decimal, and every attempt is recorded

- **Money is always `Decimal`, never `float`.** Fields are `DecimalField(max_digits=15, decimal_places=2)`; constants are built from strings, as `Decimal("100000")`; tests pass amounts as strings (`"100000.00"`) or `Decimal("...")`.
  - Bad: `MIN_OPENING_BALANCE = 100000.0`
  - Good: `MIN_OPENING_BALANCE = Decimal("100000")`
- **A balance change runs inside `transaction.atomic()` on rows locked with `select_for_update()`.** Validate once before the block for a fast failure, then validate again against the locked rows, because the balance may have changed between the two reads.
- **Save only the fields you changed.** Use `save(update_fields=["balance"])` when updating an account balance.
- **A failed transfer still leaves a `Transaction` row.** Catch the exception, save the record with `status=FAILED` outside the atomic block, then re-raise. The transaction table is the audit trail and must show failed attempts.
- **Transactions are immutable.** No endpoint updates or deletes them; `destroy` raises `PermissionDenied("Transactions cannot be deleted.")`.
- **Generated identifiers use `secrets`, not `random`, and check for collisions** with a bounded retry, as `generate_account_number` does.
- **References**: `transactions/manager.py` (`create_internal_transaction`), `accounts/manager.py` (`generate_account_number`).
