#!/bin/sh
set -e

mkdir -p /data/uploads

# Persist SQLite under /data; seed from image on first boot.
if [ ! -f /data/dev.db ]; then
  echo "Initializing SQLite database from image seed..."
  cp /app/packages/api/prisma/dev.db /data/dev.db
fi

export DATABASE_URL="${DATABASE_URL:-file:/data/dev.db}"
export UPLOADS_DIR="${UPLOADS_DIR:-/data/uploads}"

echo "Applying Prisma schema..."
cd /app
pnpm --filter @petshop/api exec prisma db push --skip-generate

cd /app/packages/api
exec node dist/main.js
