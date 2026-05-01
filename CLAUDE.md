# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MiBanquito is a Colombian digital banking app (monorepo) with a **React/TypeScript frontend** and a **Django REST Framework backend**, orchestrated via Docker Compose with a PostgreSQL 18 database.

## Development Commands

All services run in Docker. The typical workflow:

```bash
# Start all services (db, backend, frontend)
docker compose up -d --build

# View logs
docker compose logs -f

# Run Django migrations
docker compose exec backend python manage.py migrate

# Create superuser
docker compose exec backend python manage.py createsuperuser

# Run backend tests
docker compose exec backend pytest

# Run a single test file
docker compose exec backend pytest transactions/tests.py

# Apply black formatting (backend)
docker compose exec backend black .
```

Frontend dev server runs at `http://localhost:3000` (hot reload enabled via Vite).  
Django backend runs at `http://localhost:8000`.  
Django admin at `http://localhost:8000/admin/`.

## Architecture

### Frontend (`frontend/`)

**Entry point**: `src/main.tsx` → `QueryClientProvider` → `BrowserRouter` → `CustomTheme` → `App`

**Routing** (`src/App.tsx`): Public routes (`/login`, `/register`), protected routes (`/`) wrapped in a `ProtectedRoute` component that validates JWT expiration and auto-refreshes tokens.

**Auth flow**: Login POSTs to `/api/token/`, stores `access` and `refresh` tokens in `localStorage`. The Axios instance in `src/api/api.ts` automatically injects the Bearer token on every request. `ProtectedRoute` decodes the JWT with `jwt-decode` to check expiry, calls `/api/token/refresh/` if needed, redirects to `/login` on failure. Logout clears all `localStorage`.

**Path alias**: `~/*` maps to `src/*` (configured in `vite.config.ts` and `tsconfig.json`).

**Key libraries**: React Query (data fetching/caching via `~/lib/queryClient`), TanStack Form + Zod (forms + validation), MUI v9 (UI components), Axios.

**Component file rule**: Each component must live in its own file. Two or more components must never share a single `.tsx` file. If a helper component is needed inside a feature, extract it to `src/components/` following the folder conventions in `src/components/CLAUDE.md`.

### Backend (`backend/`)

**Settings**: `core/settings.py` reads all secrets and config from a `.env` file via `django-environ`.

**URL structure** (`core/urls.py`): All API routes under `/api/` using DRF's `DefaultRouter` for ViewSets. JWT endpoints at `/api/token/` and `/api/token/refresh/`.

**Apps**:
- `users` — Custom `User` model (extends `AbstractUser`) with Colombian ID fields (document_type, document_number), phone, city. `AUTH_USER_MODEL = "users.User"`.
- `accounts` — `SavingsAccount` (UUID PK, auto-generated account number `MB…`) and `AccountMovement` (immutable audit trail: DEPOSIT, WITHDRAWAL, TRANSFER_IN, TRANSFER_OUT).
- `transactions` — `Transaction` model (INTERNAL/EXTERNAL types, PENDING/COMPLETED/FAILED status, UUID reference).
- `products` — `LoanRequest` (PENDING/APPROVED/REJECTED) and `CDT` (ACTIVE/MATURED, term_days, annual_rate, maturity_date).
- `landing` — `ContactMessage` for the public contact form.
- `core` — Settings, URL config, WSGI/ASGI.

**DRF config**: Default permission is `IsAuthenticated`. JWT access token lifetime is 30 minutes; refresh is 1 day. Pagination is `PageNumberPagination` at 20 items/page. CORS allows all origins with credentials (development setting).

### Environment Variables

Backend reads from `backend/.env`:
- `DATABASE_URL` — PostgreSQL connection string (e.g., `postgresql://user:pass@db:5432/mibanquito`)
- `SECRET_KEY` — Django secret key
- `DEBUG` — Boolean

Frontend reads from `frontend/.env`:
- `VITE_API_URL` — Base URL for the Django API (e.g., `http://localhost:8000`)
