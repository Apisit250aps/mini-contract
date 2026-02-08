# -----------------------------------
# STAGE 1: Install dependencies & build
# -----------------------------------
FROM node:20-alpine AS builder

# Enable corepack for pnpm/yarn support (optional)
RUN corepack enable

# Install build dependencies
# RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy only dependency-related files first (for layer caching)
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Install dependencies with caching (uses npm here)
# RUN npm ci --prefer-offline
RUN npm ci --legacy-peer-deps
# Copy the full project
COPY . .
ARG MONGODB_URI
ENV MONGODB_URI=$MONGODB_URI
# Build the Next.js app in standalone mode
RUN NODE_OPTIONS="--max-old-space-size=2048" npm run build

# -----------------------------------
# STAGE 2: Create minimal production image
# -----------------------------------
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Install dumb-init to forward signals properly (graceful shutdown)
RUN apk add --no-cache dumb-init

# Create a non-root user and group
RUN addgroup -g 1001 -S nodegroup \
  && adduser -S nodeuser -u 1001 -G nodegroup

# Copy required files from build stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/backup /app/backup
# COPY --from=builder /app/scripts /app/scripts
# Optional: copy env if you want to bake it into the image
# Usually better to pass via runtime or docker-compose
# COPY .env .env

# Set file ownership for the non-root user
RUN chown -R nodeuser:nodegroup /app

# Switch to non-root user
USER nodeuser

# Expose the app port
EXPOSE 3000

# Use dumb-init for PID 1
ENTRYPOINT ["dumb-init"]

# Start Next.js standalone server
CMD ["node", "server.js"]