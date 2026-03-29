# MiBanquito Backend — ViewSets Implementation Plan

## Preamble: Current State Assessment

- `backend/core/settings.py` — standard Django 5 skeleton using `django-environ`; no DRF config, no custom auth model yet
- `backend/core/urls.py` — only the admin URL registered
- `backend/accounts/` — empty app (models, views, migrations all blank); registered in `INSTALLED_APPS` as the string `'accounts'`
- No `DEFAULT_AUTO_FIELD` set in settings (Django default is `BigAutoField`)
- No `AUTH_USER_MODEL` override yet

**Critical decision**: The existing `accounts` app will be repurposed for savings accounts / movements. A new `users` app will own the custom User model.

---

## Step-by-Step Ordered Task List

### Phase 1 — Foundation (must complete before any other app)

**Task 1.1** — Add `django-cors-headers` to `requirements.txt`

**Task 1.2** — Create the `users` app via `python manage.py startapp users`

**Task 1.3** — Build `users/models.py` with the custom User model

**Task 1.4** — Update `core/settings.py` (all settings changes below)

**Task 1.5** — Run initial migrations

### Phase 2 — `users` app completion

- `users/validators.py` — `BankPasswordValidator`
- `users/serializers.py` — `UserRegisterSerializer`, `UserProfileSerializer`
- `users/views.py` — `UserViewSet`, `AuthViewSet`
- `users/urls.py` — router wiring
- `users/admin.py` — register with `UserAdmin`

### Phase 3 — `accounts` app build-out

- `accounts/models.py` — `SavingsAccount`, `AccountMovement`
- `accounts/serializers.py`
- `accounts/views.py` — `SavingsAccountViewSet` with `movements` action
- `accounts/urls.py`
- Migrations: `makemigrations accounts && migrate`

### Phase 4 — `transactions` app

- Create app, model, serializers, views, urls, migrations

### Phase 5 — `products` app

- Create app, `LoanRequest`, `CDT` models, serializers, views, urls, migrations

### Phase 6 — `simulators` app

- Create app (no models)
- `simulators/services.py` — SODA API fetch + calculation functions
- `simulators/serializers.py`, `simulators/views.py`, `simulators/urls.py`

### Phase 7 — `landing` app

- Create app, `ContactMessage` model, `data.py`, serializers, views, urls, migrations

### Phase 8 — Root URL wiring

- Update `core/urls.py` to include all six app routers under `/api/`

---

## File-by-File Outline

### `backend/requirements.txt`
Add: `django-cors-headers`

---

### `backend/core/settings.py` (modify)

| Setting | Action | Value |
|---|---|---|
| `DEFAULT_AUTO_FIELD` | Add | `'django.db.models.BigAutoField'` |
| `AUTH_USER_MODEL` | Add | `'users.User'` |
| `SESSION_COOKIE_AGE` | Add | `120` |
| `INSTALLED_APPS` | Extend | `rest_framework`, `corsheaders`, all 6 app configs |
| `MIDDLEWARE` | Insert before `CommonMiddleware` | `corsheaders.middleware.CorsMiddleware` |
| `REST_FRAMEWORK` | Add dict | SessionAuthentication + IsAuthenticated + PageNumberPagination defaults |
| `CORS_ALLOWED_ORIGINS` | Add | env list, default `['http://localhost:3000']` |
| `CORS_ALLOW_CREDENTIALS` | Add | `True` |
| `CORS_ALLOW_HEADERS` | Add | `default_headers + ['x-csrftoken']` |
| `ALLOWED_HOSTS` | Change | env list, default `['*']` |
| `AUTH_PASSWORD_VALIDATORS` | Replace | Single entry: `users.validators.BankPasswordValidator` |

---

### `backend/users/models.py`

```
User(AbstractUser):
  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = ['username', 'document_type', 'document_number', 'full_name']

  document_type   — CharField, choices: CC / CE / NIT / PP
  document_number — CharField(max_length=20, unique=True)
  full_name       — CharField(max_length=255)
  city            — CharField(max_length=100)
  phone           — CharField(max_length=20)
  email           — EmailField(unique=True)   # override AbstractUser's non-unique email
  occupation      — CharField, choices: INDEPENDENT / EMPLOYEE
```

---

### `backend/users/validators.py`

```
class BankPasswordValidator:
  min_length = 12
  validate(password, user=None):
    — min 12 chars
    — at least 1 uppercase [A-Z]
    — at least 1 lowercase [a-z]
    — at least 1 digit \d
    — at least 1 special character
    — raise ValidationError listing ALL failures (not just first)
  get_help_text(): human-readable requirements string
```

---

### `backend/users/serializers.py`

```
UserRegisterSerializer(ModelSerializer):
  fields: document_type, document_number, full_name, city, phone, email, occupation, password (write_only), password_confirm (write_only)
  validate_password: call django.contrib.auth.password_validation.validate_password()
  validate: check password == password_confirm
  create: pop password_confirm, call User.objects.create_user()

UserProfileSerializer(ModelSerializer):
  fields: id, document_type, document_number, full_name, city, phone, email, occupation
  read_only_fields: id, document_type, document_number, email
```

---

### `backend/users/views.py`

```
UserViewSet(ModelViewSet):
  @action(detail=False, methods=['post'], permission_classes=[AllowAny])
  def register: UserRegisterSerializer -> 201

  @action(detail=False, methods=['get','put'], permission_classes=[IsAuthenticated])
  def me: GET profile / PUT partial update

AuthViewSet(ViewSet):
  @action(detail=False, methods=['post'], permission_classes=[AllowAny])
  def login: authenticate(request, username=email, password=...) -> session login -> return profile

  @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
  def logout: call logout(request) -> 200
```

---

### `backend/accounts/models.py`

```
SavingsAccount(Model):
  id             — UUIDField(primary_key=True)
  user           — FK(settings.AUTH_USER_MODEL)
  account_number — CharField(max_length=20, unique=True)  # auto: 'MB' + 10 random digits
  balance        — DecimalField(max_digits=15, decimal_places=2, default=0)
  is_active      — BooleanField(default=True)
  created_at     — DateTimeField(auto_now_add=True)

AccountMovement(Model):
  id            — UUIDField(primary_key=True)
  account       — FK(SavingsAccount, related_name='movements')
  movement_type — CharField, choices: DEPOSIT / WITHDRAWAL / TRANSFER_IN / TRANSFER_OUT
  amount        — DecimalField(max_digits=15, decimal_places=2)
  description   — CharField(max_length=255, blank=True)
  timestamp     — DateTimeField(auto_now_add=True)
```

---

### `backend/accounts/views.py`

```
SavingsAccountViewSet(ModelViewSet):
  http_method_names: ['get','post','head','options']  # no update/delete
  get_queryset(): filter(user=request.user)
  perform_create:
    — validate initial_deposit >= 100_000
    — save(user=request.user, balance=initial_deposit)
    — create AccountMovement(DEPOSIT, amount=initial_deposit, desc='Apertura de cuenta')

  @action(detail=True, methods=['get'])
  def movements: paginated AccountMovement list for the account
```

`SavingsAccountCreateSerializer` accepts `initial_deposit` (write-only, min 100_000), others read-only.

---

### `backend/transactions/models.py`

```
Transaction(Model):
  id                   — UUIDField(primary_key=True)
  source_account       — FK(SavingsAccount, null=True, related_name='outgoing')
  destination_account  — FK(SavingsAccount, null=True, related_name='incoming')
  transaction_type     — CharField, choices: INTERNAL / EXTERNAL
  amount               — DecimalField(max_digits=15, decimal_places=2)
  status               — CharField, choices: PENDING / COMPLETED / FAILED, default=PENDING
  reference            — UUIDField(unique=True, default=uuid.uuid4)
  created_at           — DateTimeField(auto_now_add=True)
  description          — CharField(max_length=255, blank=True)
```

---

### `backend/transactions/views.py`

```
TransactionViewSet(ViewSet):
  def list: transactions where source or destination belongs to request.user

  @action(detail=False, methods=['post'])
  def transfer:
    — validate TransferSerializer
    — verify source_account belongs to request.user
    — atomic transaction:
        1. select_for_update() on both accounts (sorted by UUID to avoid deadlock)
        2. check balance >= amount
        3. debit source, credit destination
        4. create AccountMovement x2 (TRANSFER_OUT, TRANSFER_IN)
        5. create Transaction(status=COMPLETED)
    — on exception: status=FAILED, return 400
```

---

### `backend/products/models.py`

```
LoanRequest(Model):
  id, user(FK), amount, term_months, monthly_rate(DecimalField 5,4), status(PENDING/APPROVED/REJECTED),
  created_at, reviewed_by(FK User null), reviewed_at(null)

CDT(Model):
  id, user(FK), amount, term_days, annual_rate(DecimalField 5,4), maturity_date, status(ACTIVE/MATURED), created_at
```

All rates stored as decimal fractions (0.015 = 1.5%, 0.12 = 12%).

---

### `backend/simulators/services.py`

```
DEFAULT_CDT_RATE = Decimal('0.12')    # 12% EA fallback
DEFAULT_LOAN_RATE = Decimal('0.015')  # 1.5% monthly fallback

fetch_current_rates() -> dict:
  — HTTP GET to SODA API (timeout=3s)
  — on exception: return defaults

calculate_cdt(capital, ea, days) -> Decimal:
  interest = capital * ((1 + ea) ** (days / 365) - 1)

calculate_loan_quota(principal, monthly_rate, term_months) -> Decimal:
  quota = P * (i*(1+i)**n) / ((1+i)**n - 1)  where i = monthly_rate (already a fraction)
```

---

### `backend/landing/data.py`

Static dict `LANDING_INFO` with mission, vision, products list, contact info.

---

### `backend/core/urls.py` (replace)

```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/', include('accounts.urls')),
    path('api/', include('transactions.urls')),
    path('api/', include('products.urls')),
    path('api/', include('simulators.urls')),
    path('api/', include('landing.urls')),
]
```

---

## Migration Order

1. `makemigrations users` (no FK deps)
2. `makemigrations accounts` (FK to users)
3. `makemigrations transactions` (FK to accounts)
4. `makemigrations products` (FK to users)
5. `makemigrations landing` (no FK deps)
6. `migrate` (apply all)

---

## Key Caveats

1. **USERNAME_FIELD = 'email'**: `authenticate()` call uses `username=email_value` (Django maps internally)
2. **CSRF**: DRF SessionAuthentication enforces CSRF — frontend must send `X-CSRFToken` header
3. **SESSION_COOKIE_AGE = 120**: Very short — expect frequent re-logins during dev testing
4. **select_for_update() deadlock prevention**: Always acquire locks sorted by account UUID
5. **Account number generation**: Random `'MB' + 10 digits` with uniqueness retry loop
6. **Rate storage**: All rates are decimal fractions (not percentages)
7. **Pagination**: `PAGE_SIZE = 20` added to REST_FRAMEWORK settings
