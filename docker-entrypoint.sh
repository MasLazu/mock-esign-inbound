#!/bin/sh

set -e

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations
php artisan migrate --force

# Execute PHP-FPM
exec "$@"