# Stage 1: Install dependencies and build the application. Dependencies are
# installed in place with the bun binary instead of a separate bun stage:
# copying node_modules across stages cost ~14 s per build.
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=oven/bun:1-alpine /usr/local/bin/bun /usr/local/bin/bun
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .

ARG NEXT_PUBLIC_SITE_URL=https://klaps.space
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
# Public MinIO mirror with TMDB images (scraper keeps it populated);
# empty means images load straight from the TMDB CDN.
ARG NEXT_PUBLIC_TMDB_IMAGE_BASE_URL
ENV NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=$NEXT_PUBLIC_TMDB_IMAGE_BASE_URL
ARG API_URL
ENV API_URL=$API_URL
ARG MAINTENANCE_MODE
ENV MAINTENANCE_MODE=$MAINTENANCE_MODE

RUN --mount=type=secret,id=internal_api_key \
    INTERNAL_API_KEY="$(cat /run/secrets/internal_api_key)" npm run build

# Stage 2: Production runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Mount point of the persistent image-optimizer cache (docker-compose.yml).
# Created here so a fresh named volume inherits the nextjs ownership.
RUN mkdir -p .next/cache/images && chown -R nextjs:nodejs .next/cache

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
