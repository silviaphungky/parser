# Base image
FROM node:20.11.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Install compatibility libraries
RUN apk add --no-cache libc6-compat

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm install --legacy-peer-deps; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Build the application
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy application files
COPY ./src /app/src
COPY ./public /app/public
COPY ./next.config.mjs /app/next.config.mjs
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
COPY ./postcss.config.mjs /app/postcss.config.mjs
COPY ./tailwind.config.ts /app/tailwind.config.ts
COPY ./tsconfig.json /app/tsconfig.json

# Build the Next.js application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

# Install production dependencies
RUN npm install dotenv sharp --legacy-peer-deps

# Create a non-root user for running the app
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

COPY --from=builder  /app/next.config.mjs next.config.mjs


USER nextjs

EXPOSE 3003

ENV PORT 3003

CMD HOSTNAME="0.0.0.0" node server.js
