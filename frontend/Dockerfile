# 🐳 Frontend Dockerfile - Next.js + TypeScript  
# Multi-stage build otimizado para produção

# =====================================
# STAGE 1: Dependencies (Base)
# =====================================
FROM node:20-alpine AS base
WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache libc6-compat

# Configurar Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# =====================================
# STAGE 2: Dependencies
# =====================================
FROM base AS deps
WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci

# =====================================
# STAGE 3: Build
# =====================================
FROM base AS build
WORKDIR /app

# Copiar dependências
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte
COPY . .

# Configurar variáveis de ambiente para build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build da aplicação
RUN npm run build

# =====================================
# STAGE 4: Production
# =====================================
FROM node:20-alpine AS production
WORKDIR /app

# Configurações de produção
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários para produção
COPY --from=build /app/public ./public

# Copiar build otimizado
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

# Mudar para usuário não-root
USER nextjs

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Comando para iniciar
CMD ["node", "server.js"]