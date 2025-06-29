#!/bin/bash

# Deployment Script for Transparency Co
# Usage: ./deploy.sh

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "artisan" ]; then
    print_error "This doesn't appear to be a Laravel project. Please run this script from the project root."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_status ".env file created. Please configure it before continuing."
        exit 1
    else
        print_error ".env.example file not found. Please create a .env file manually."
        exit 1
    fi
fi

print_status "Installing Composer dependencies..."
composer install --optimize-autoloader --no-dev --no-interaction

print_status "Installing NPM dependencies..."
npm install --production

print_status "Building frontend assets..."
npm run build

print_status "Setting up storage link..."
php artisan storage:link

print_status "Running database migrations..."
php artisan migrate --force

print_status "Clearing and caching configurations..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

print_status "Setting proper permissions..."
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || print_warning "Could not change ownership (may need sudo)"

print_status "Clearing old caches..."
php artisan cache:clear
php artisan config:clear

print_status "Optimizing application..."
php artisan optimize

print_status "✅ Deployment completed successfully!"

echo ""
print_status "Next steps:"
echo "1. Verify your application is running correctly"
echo "2. Check error logs if there are any issues"
echo "3. Test all major functionality"
echo "4. Set up monitoring and backups"

echo ""
print_status "Useful commands:"
echo "- View logs: tail -f storage/logs/laravel.log"
echo "- Clear all caches: php artisan optimize:clear"
echo "- Check application status: php artisan about" 