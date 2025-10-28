# 📋 API de Gerenciamento de Tarefas

Uma API REST moderna e completa para gerenciamento de tarefas, construída com NestJS, TypeScript, PostgreSQL e autenticação JWT. Este projeto demonstra as melhores práticas de desenvolvimento backend incluindo controle de acesso baseado em funções, documentação completa da API e estrutura profissional do projeto.

## ✨ Funcionalidades

- 🔐 Autenticação JWT com roles (Admin/User)
- 📋 CRUD completo de tarefas com status e prioridades
- � Gerenciamento de usuários
- 📊 Estatísticas de tarefas
-  Documentação Swagger interativa
- 🌱 Seed com dados de teste
- 🧪 94 testes automatizados

## 🛠️ Stack

NestJS 11 • TypeScript • PostgreSQL • TypeORM • JWT • Swagger

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL em execução

## 🚀 Início Rápido

### 1. Clonar e Instalar Dependências

```bash
git clone <repository-url>
cd backend
npm install
```

### 2. Configuração do Banco de Dados

Crie um banco de dados PostgreSQL e atualize as variáveis de ambiente:

```bash
# Criar banco de dados
createdb task_management

# Ou usando linha de comando do PostgreSQL
psql -U postgres -c "CREATE DATABASE task_management;"
```

### 3. Configuração do Ambiente

A aplicação usa a seguinte configuração padrão (localizada em `src/database/database.config.ts`):

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=admin123
DATABASE_NAME=task_management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

> **Nota**: Para produção, certifique-se de atualizar o arquivo `.env` com credenciais seguras.

### 4. Inicializar Banco com Dados de Exemplo

```bash
# Popular banco de dados com usuários e tarefas de exemplo
npm run seed:dev
```

Isso cria:
- **Usuário Admin**: `admin@test.com` / `password123`
- **Usuário Regular**: `user@test.com` / `password123`
- **8 Tarefas de Exemplo** com diferentes status e prioridades

### 5. Iniciar a Aplicação

```bash
# Modo desenvolvimento (com hot reload)
npm run start:dev

# Modo produção
npm run start:prod
```

A API estará disponível em:
- **Endpoint da API**: http://localhost:3001
- **Documentação Swagger**: http://localhost:3001/api

## 📖 Documentação da API

### Autenticação

Todos os endpoints protegidos requerem um token JWT no cabeçalho Authorization:
```
Authorization: Bearer <jwt-token>
```

### Credenciais de Teste

Após executar o comando seed, você pode usar estas credenciais:

| Função | Email | Senha |
|--------|-------|-------|
| Admin | admin@test.com | password123 |
| Usuário | user@test.com | password123 |

### API Endpoints

Todos os endpoints estão documentados no **Swagger**: http://localhost:3001/api

## 🏗️ Estrutura do Projeto

```
src/
├── auth/                 # Módulo de autenticação
│   ├── dto/             # Objetos de transferência de dados
│   ├── guards/          # Guards de rota
│   ├── strategies/      # Estratégias do Passport
│   └── interfaces/      # Interfaces de autenticação
├── users/               # Módulo de gerenciamento de usuários
│   ├── dto/            # DTOs de usuário
│   └── entities/       # Entidade de usuário
├── tasks/              # Módulo de gerenciamento de tarefas
│   ├── dto/           # DTOs de tarefa
│   └── entities/      # Entidade de tarefa
├── database/          # Configuração do banco de dados
│   └── seeds/         # Seed do banco de dados
└── scripts/           # Scripts utilitários
```

## 🧪 Testes

Este projeto possui uma **cobertura de testes abrangente** com **94 testes automatizados** que garantem a qualidade e confiabilidade do código.

### 📊 Estatísticas de Testes

- **94 testes** passando com sucesso
- **7 suítes de teste** cobrindo todos os módulos principais
- **Cobertura completa** de controllers, services e lógica de negócio
- **Testes unitários** com mocks e isolamento adequado
- **38 testes de Services** + **56 testes de Controllers** = **94 total**

### 🎯 Estrutura de Testes

#### **Testes de Serviços (Services)**
| Módulo | Testes | Cobertura |
|--------|--------|-----------|
| **AuthService** | 5 testes | Autenticação JWT, validação de usuários, registro |
| **TasksService** | 17 testes | CRUD completo, controle de acesso, filtragem |
| **UsersService** | 16 testes | Gerenciamento de usuários, segurança, validação |
| **Subtotal** | **38 testes** | Toda lógica de negócio coberta |

#### **Testes de Controladores (Controllers)**
| Módulo | Testes | Cobertura |
|--------|--------|-----------|
| **AuthController** | 15 testes | Login, registro, LocalAuthGuard, tratamento de erros |
| **TasksController** | 16 testes | Endpoints REST, JwtAuthGuard, autorização |
| **UsersController** | 24 testes | Admin vs usuário, RolesGuard, permissões |
| **AppController** | 1 teste | Health check básico |
| **Subtotal** | **56 testes** | Camada HTTP completamente testada |

### 🛡️ Aspectos Realmente Testados

#### **Segurança e Autenticação**
- ✅ **Hash de senhas com bcryptjs** (UsersService - salt rounds 10)
- ✅ **Geração de tokens JWT** (AuthService.login com JwtService)
- ✅ **Validação de credenciais** (AuthService.validateUser com bcrypt.compare)
- ✅ **Guards mockados** (JwtAuthGuard, LocalAuthGuard, RolesGuard nos controllers)
- ✅ **Controle de roles** (Admin vs User em TasksService e UsersController)

#### **Lógica de Negócio Completa**
- ✅ **CRUD de tarefas** (create, findAll, findOne, update, remove)
- ✅ **CRUD de usuários** (create, findAll, findOne, update, remove)
- ✅ **Controle de acesso** (usuários só veem suas tarefas, admins veem tudo)
- ✅ **Estatísticas de tarefas** (contadores por status para user/admin)
- ✅ **Validação de propriedade** (users só podem editar suas próprias tarefas)

#### **Tratamento de Erros Específicos**
- ✅ **NotFoundException** (user/task não encontrado)
- ✅ **ConflictException** (email duplicado no registro)
- ✅ **ForbiddenException** (user tentando acessar task de outro user)
- ✅ **Propagação de erros** (service errors repassados para controllers)

#### **Validações e Edge Cases**
- ✅ **Email único** (ConflictException quando email já existe)
- ✅ **Role padrão** (USER quando não especificado no registro)
- ✅ **Dados sem senha** (responses excluem campo password)
- ✅ **Extração de user.id** (controllers extraem corretamente do AuthRequest)
- ✅ **Verificação de propriedade** (users só editam suas próprias tarefas)



### Executando os Testes

```bash
# Todos os testes (94 passando)
npm run test

# Com cobertura
npm run test:cov
```

## 🚀 Exemplos de Uso

### 1. Registro de Usuário
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "password": "password123",
    "role": "user"
  }'
```

### 2. Login de Usuário
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123"
  }'
```

### 3. Criar Tarefa
```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "title": "Completar documentação da API",
    "description": "Escrever documentação abrangente da API para o sistema de gerenciamento de tarefas",
    "priority": "high",
    "dueDate": "2025-10-30T10:00:00Z"
  }'
```

### 4. Obter Todas as Tarefas
```bash
curl -X GET "http://localhost:3001/tasks" \
  -H "Authorization: Bearer <jwt-token>"
```

## 🔐 Segurança

- Hash de senhas com bcryptjs
- JWT com expiração de 7 dias
- Role-based access control (Admin/User)
- Validação com class-validator

---

**Construído com ❤️ usando NestJS, TypeScript e PostgreSQL**
