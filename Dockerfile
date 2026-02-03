FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application (no build secrets needed for SQLite)
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create data directory for SQLite
RUN mkdir -p /app/data

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy node_modules and prisma schema for migrations (needed by nextjs)
COPY --from=deps /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs prisma ./prisma

# Set up data directory ownership
RUN chown -R nextjs:nodejs /app/data

# Create entrypoint script to push schema then start server
RUN echo '#!/bin/sh\necho "Applying database schema..."\nnpx prisma db push --skip-generate\necho "Starting server..."\nnode server.js' > /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["/app/entrypoint.sh"]
