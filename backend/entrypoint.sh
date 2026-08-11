#!/usr/bin/env bash
set -e

echo "Waiting for PostgreSQL database at db:5432..."

python -c "
import socket, time
while True:
    try:
        with socket.create_connection(('db', 5432), timeout=2):
            print('PostgreSQL is up and accepting connections!')
            break
    except Exception:
        time.sleep(1)
"

echo "Collecting static files..."
python manage.py collectstatic --no-input

echo "Applying database migrations..."
python manage.py migrate

echo "Starting Gunicorn server on 0.0.0.0:8000..."
exec gunicorn --bind 0.0.0.0:8000 config.wsgi:application
