# 🚀 Sistema de Gerenciamento de Tarefas

Sistema completo de gerenciamento de tarefas com **autenticação JWT**, **níveis de usuário** e **interface moderna**.

**Stack:** Next.js 16 + NestJS + PostgreSQL + Docker

[![Made with Next.js](https://img.shields.io/badge/Next.js-16.0.0-black.svg)](https://nextjs.org/)
[![Made with NestJS](https://img.shields.io/badge/NestJS-11.0.1-red.svg)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-blue.svg)](https://postgresql.org/)

## 🐳 Executar com Docker

### 📋 Pré-requisitos
- Docker Desktop instalado e rodando

### 🚀 Comandos (na ordem):
```bash
# 1. Subir todos os containers
docker-compose up --build -d

# 2. Criar banco de dados
docker-compose exec postgres createdb -U postgres task_management

# 3. Popular com dados de exemplo
docker-compose exec backend node dist/scripts/seed.js

# 4. Verificar status
docker-compose ps
```

### 🛑 Para parar:
```bash
docker-compose down
```

## 🛠️ Desenvolvimento Local

### Backend (NestJS)
```bash
cd backend
npm install
npm run start:dev
```

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

### Banco de Dados
```bash
# PostgreSQL local (versão 18)
createdb task_management
# Ou usar Docker apenas para o banco:
docker run -d -p 5432:5432 -e POSTGRES_DB=task_management -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=admin123 postgres:18-alpine
```

## 🌐 URLs de Acesso

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001  
- **Swagger Docs:** http://localhost:3001/api
- **PostgreSQL:** localhost:5432

## 🔑 Credenciais de Teste

```
👩‍💼 Admin (Maria Silva): admin@test.com / password123
👨‍💻 User (João Santos):  user@test.com  / password123
```

## 🏗️ Arquitetura

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Frontend   │    │   Backend   │    │ PostgreSQL  │
│  Next.js 16 │◄──►│  NestJS     │◄──►│  Database   │
│  Port 3000  │    │  Port 3001  │    │  Port 5432  │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 🎯 Funcionalidades

### ✅ Autenticação
- Login/Registro com JWT
- Diferentes níveis (Admin/User)
- Sessões persistentes

### ✅ Gerenciamento de Tarefas
- **Admin:** Visualiza todas as tarefas
- **User:** Apenas suas próprias tarefas
- CRUD completo (Criar, Listar, Editar, Excluir)

### ✅ Interface Moderna
- Design responsivo e dark theme
- Componentes reutilizáveis
- UX otimizada para produtividade

## 🧪 Testes

```bash
# Backend - 94 testes
cd backend
npm run test
```

## 🛠️ Stack Técnica

- **Frontend:** Next.js 16.0.0, React 19.2.0, TypeScript, Tailwind CSS 4
- **Backend:** NestJS 11.0.1, TypeScript, JWT, Swagger
- **Database:** PostgreSQL 18
- **Infraestrutura:** Docker, Docker Compose
- **Validação:** Class-validator
- **Testes:** Jest, Supertest

