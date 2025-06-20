# Etapa 1: build
FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependencias
COPY package*.json ./
RUN npm install

# Copia el código fuente
COPY . .

# 👇 Genera el cliente de Prisma
RUN npx prisma generate

# Compila TypeScript
RUN npm run build

# Etapa 2: producción
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# Copia la app compilada y el cliente de Prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma /app/node_modules/@prisma

# Asegura que también copies el esquema si lo necesitas
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
