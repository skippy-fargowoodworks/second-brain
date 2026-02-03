#!/bin/bash
set -e

echo "=== Entrypoint script starting ==="
echo "Current directory: $(pwd)"
echo "Files in /app:"
ls -la /app | head -20

echo ""
echo "Applying database schema..."
if [ -f "/app/node_modules/.bin/prisma" ]; then
  /app/node_modules/.bin/prisma db push --skip-generate || echo "Warning: Schema push failed"
else
  echo "ERROR: prisma not found at /app/node_modules/.bin/prisma"
fi

echo ""
echo "=== Starting application server ==="
exec node /app/server.js
