FROM python:3.14-alpine
WORKDIR /app
# Dependencias de sistema para psycopg2 (Postgres)
RUN apk add --no-cache gcc musl-dev postgresql-dev libffi-dev
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
# El comando lo maneja el docker-compose
