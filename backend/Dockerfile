# Use Python 3.11 slim image for fast builds and small container footprint
FROM python:3.11-slim

# Prevent Python from writing .pyc files and buffer stdout/stderr
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

WORKDIR /app

# Install system dependencies required for psycopg2 and Pillow
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application files
COPY . .

# Expose HTTP port
EXPOSE 8000

# Automated deployment entrypoint: collect static files, run migrations, start Gunicorn
CMD ["sh", "-c", "python manage.py collectstatic --no-input && python manage.py migrate && gunicorn xmp_backend.wsgi:application --bind 0.0.0.0:${PORT:-8000} --access-logfile - --error-logfile -"]
