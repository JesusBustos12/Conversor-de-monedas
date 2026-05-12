# Stage 1: Build Frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Server
FROM node:22-alpine AS backend-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev

# Stage 3: Runtime (Producción)
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copiar dependencias y código del server
COPY --from=backend-builder /app/server/node_modules ./server/node_modules
COPY server/ ./server/

# Copiar el build del frontend para que el server lo sirva
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Copiar assets públicos adicionales si existen fuera de frontend/dist
COPY public/ ./public/

USER node
EXPOSE 3000

CMD ["node", "server/src/index.js"]
