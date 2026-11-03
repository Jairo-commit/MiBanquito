FROM python:3.14-alpine
WORKDIR /app
# System dependencies for psycopg2 (Postgres)
RUN apk add --no-cache gcc musl-dev postgresql-dev libffi-dev
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
# The run command is defined in docker-compose
