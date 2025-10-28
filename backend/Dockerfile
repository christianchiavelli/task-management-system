# 🐳 Backend Dockerfile - NestJS + TypeScript
# Multi-stage build para otimizar o tamanho final

# =====================================
# STAGE 1: Dependencies (Base)
# =====================================
FROM node:20-alpine AS base
WORKDIR /app

# Instalar dependências do sistema necessárias
RUN apk add --no-cache libc6-compat

# Copiar package files
COPY package*.json ./

# =====================================
# STAGE 2: Dependencies (Development)
# =====================================
FROM base AS deps
# Instalar todas as dependências (dev + prod)
RUN npm ci

# =====================================
# STAGE 3: Build
# =====================================
FROM base AS build
WORKDIR /app

# Copiar dependências do stage anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# =====================================
# STAGE 4: Production
# =====================================
FROM node:20-alpine AS production
WORKDIR /app

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Instalar apenas dependências de produção
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts

# Copiar build da aplicação
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist

# Mudar para usuário não-root
USER nestjs

# Expor porta
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "http.get('http://localhost:3001/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Comando para iniciar a aplicação
CMD ["node", "dist/main.js"]