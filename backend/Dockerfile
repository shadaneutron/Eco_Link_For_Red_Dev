# Base Python Image
FROM python:3.11-slim

# Prevent Python from writing pyc files & buffer stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy and install python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . /app/

# Make scripts executable
RUN chmod +x /app/build.sh /app/entrypoint.sh

# Expose Django port
EXPOSE 8000

# Default command
CMD ["/app/entrypoint.sh"]
