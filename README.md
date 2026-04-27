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
