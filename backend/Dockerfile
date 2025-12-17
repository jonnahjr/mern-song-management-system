# ---- Builder stage ----
FROM node:18-alpine AS builder
WORKDIR /app

# Copy backend package and lockfiles
COPY backend/package*.json ./
RUN npm ci

# Copy backend source and tsconfig
COPY backend/tsconfig.json ./tsconfig.json
COPY backend/src ./src
RUN npm run build

# ---- Runtime stage ----
FROM node:18-alpine AS runner
WORKDIR /app

# Only copy the compiled output and production deps
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 5000
CMD ["node", "dist/server.js"]