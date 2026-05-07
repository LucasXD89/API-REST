# Etapa 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Etapa 2: Producción
FROM node:18-alpine

ESCUELA DE TECNLOGIA DE INFORMACION

SEMINARIO DE COMPLEMENTACION II Instructor: Mg. Ing. Carlos Sánchez Villarreal
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Usuario no root por seguridad
RUN addgroup -g 1001 -S nodejs &amp;&amp; \
adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000
CMD [&quot;npm&quot;, &quot;start&quot;]