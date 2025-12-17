# ---- Builder stage ----
FROM node:18-alpine AS builder
WORKDIR /app

# Copy backend package and lockfiles
COPY backend/package*.json ./
# Use npm install instead of npm ci to avoid lockfile/version mismatch errors in Render
RUN npm install

# Copy backend source and tsconfig
COPY backend/tsconfig.json ./tsconfig.json
COPY backend/src ./src
RUN npm run build

# ---- Runtime stage ----
FROM node:18-alpine AS runner
WORKDIR /app

# Only copy the compiled output and production deps
COPY --from=builder /app/package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 5000
CMD ["node", "dist/server.js"]