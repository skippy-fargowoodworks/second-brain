#!/bin/bash
set -e

echo "=== Initializing Second Brain ==="

# Ensure data directory exists and is writable
mkdir -p /app/data
chmod 755 /app/data

echo "Applying database schema..."
npx prisma db push --skip-generate

echo "Database ready!"
echo ""
echo "=== Starting application server ==="
exec node server.js
