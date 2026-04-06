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

*Copyright © 2026 MiBanquito - Institución Universitaria de Envigado*
