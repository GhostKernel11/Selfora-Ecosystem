# Use official Node.js image with Debian-based Linux
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Install build dependencies required for native Node modules (better-sqlite3)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

RUN npm prune --omit=dev

# Production Stage
FROM node:20-bookworm-slim AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app /app

EXPOSE 10000

CMD ["npm", "start"]