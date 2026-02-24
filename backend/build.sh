#!/usr/bin/env bash
# exit on error
set -o errexit

# Install python dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --no-input

# Run migrations
python manage.py migrate

# Load data from fixture (One-time migration)
if [ -f "data.json" ]; then
    echo "Loading data from data.json..."
    python manage.py loaddata data.json
fi
