# 🏦 MiBanquito - Core Banking Platform

MiBanquito is a specialized banking solution designed for managing savings accounts, processing internal/external transfers, and simulating financial products like loans and CDTs. This project follows **ISO/IEC 25010 Quality Standards**, prioritizing reliability, security, and seamless user interaction.

---

## 🚀 Prerequisites

To ensure a consistent development environment, we use Docker to manage our Python 3.14, Node 24, and PostgreSQL 18 stack:

* **Docker Desktop** (v20.10+)
* **Docker Compose** (v2.0+)
* **Git**

---

## 🛠️ Complete Installation & Setup Guide

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd MiBanquito
```

### 2. Configure Environment Variables

Create a file named `.env` in the root directory.

### 2.1 Install Frontend Dependencies Locally

The frontend source is mounted into Docker, but your local editor and TypeScript server still need `frontend/node_modules` on the host. Run this once after cloning:

```bash
cd frontend
npm install
```

Do not commit `node_modules` to GitHub; it should remain local and is usually ignored by `.gitignore`.

### 3. Build and Start All Services

This command builds the images and starts the database, backend, and frontend containers in the background:

```bash
docker compose up -d --build
```

### 4. Database Initialization (Django Migrations)

```bash
docker compose exec backend python manage.py migrate
```

### 5. Create Administrative User (Advisor Role)

The Advisor needs this account to evaluate, approve, or reject loan requests:

```bash
docker compose exec backend python manage.py createsuperuser
```

---

## 🌐 Local Access Points

| Service         | URL                           | Description                   |
| :-------------- | :---------------------------- | :---------------------------- |
| **Frontend**    | `http://localhost:3000`       | Landing page and User SPA     |
| **Backend API** | `http://localhost:8000`       | Django Rest Framework service |
| **Admin Panel** | `http://localhost:8000/admin` | Advisor/Management interface  |

---

**Monitor Real-time Logs:**

```bash
docker compose logs -f
```

**Enter the Backend Container Shell:**

```bash
docker compose exec backend sh
```

**Check Service Status:**

```bash
docker compose ps
```

---

## Backend Summary

The backend is a **Django REST Framework** API running on Python 3.14 with a PostgreSQL 18 database. All secrets are loaded from `backend/.env` via `django-environ`.

### Authentication

JWT-based auth via `djangorestframework-simplejwt`. Access tokens expire in **30 minutes**; refresh tokens last **1 day**. All API endpoints require authentication by default (`IsAuthenticated`).

| Endpoint | Description |
| :--- | :--- |
| `POST /api/user/register/` | Create a new user account |
| `GET /api/user/me/` | Retrieve the authenticated user's profile |
| `POST /api/token/` | Obtain access + refresh token pair |
| `POST /api/token/refresh/` | Refresh an expired access token |

### Apps & Data Models

**`users`** — Custom `User` model extending `AbstractUser` with Colombian ID fields (`document_type`, `document_number`), phone, and city.

**`accounts`** — `SavingsAccount` with an auto-generated `MB…` account number, decimal balance, and active flag. Exposes `/api/accounts/` as a full ModelViewSet (list, create, retrieve, update, destroy). Key rules:
- Opening balance minimum: **$100,000**.
- `account_number`, `user`, and `created_at` are read-only; the number is generated automatically on creation.
- Superusers see all accounts; regular users see only their own.

**`transactions`** — `Transaction` (UUID PK, UUID reference, INTERNAL/EXTERNAL type, PENDING/COMPLETED/FAILED status). Exposes `/api/transactions/` as a ModelViewSet. Key rules:
- **INTERNAL** — transfers between two savings accounts within the platform. Requires `source_account`, `destination_account` (or `to_account_number`), and `amount`. Balances are updated atomically using `SELECT FOR UPDATE` to prevent race conditions.
- **EXTERNAL** — withdrawals to outside the platform. Requires only `source_account` and `amount`; no destination account is stored.
- Both types validate: minimum amount ($0.01), active accounts, sufficient funds, and (for internal) that source ≠ destination.
- `status` and `reference` are read-only; a failed atomic block records the transaction as `FAILED` before re-raising.
- Transactions cannot be deleted (returns `403`). Users only see transactions where they are the source or destination account holder; superusers see all.

**`products`** — Two financial product models:
- `LoanRequest` — UUID PK, amount, term in months, monthly rate, PENDING/APPROVED/REJECTED status, reviewed by superuser. Exposes `/api/products/loans/`.
- `CDT` (Certificate of Deposit) — UUID PK, amount, term in days, annual rate, maturity date, ACTIVE/MATURED status. Exposes `/api/products/cdts/`.

### Key Configuration

- **Pagination**: `PageNumberPagination` at 20 items per page.
- **CORS**: All origins allowed with credentials (development setting).
- **Admin panel**: Superusers can review and approve/reject loan requests at `/admin/`.
- **Code style**: `black` formatter enforced.

---

## 🧪 Running Tests

### Backend (pytest)

```bash
# Run the full test suite
docker compose exec backend pytest

# Run a single test file
docker compose exec backend pytest transactions/tests.py

# Run with verbose output
docker compose exec backend pytest -v

# Run with coverage report
docker compose exec backend pytest --cov
```

### Frontend (Vitest)

The frontend dependencies must be installed locally first (see step 2.1). Then run from the `frontend/` directory:

```bash
# One-shot run (CI-friendly)
cd frontend
npm run test:run

# Watch mode (re-runs on file changes during development)
npm test

# With HTML coverage report (output in frontend/coverage/index.html)
npm run coverage
```

Or via Docker if the frontend container is running:

```bash
docker compose exec frontend npm run test:run
```

---

*Copyright © 2026 MiBanquito - Institución Universitaria de Envigado*
