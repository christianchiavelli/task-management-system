-- Script de inicialização do PostgreSQL
-- Executado automaticamente quando o container é criado

-- Criar extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar schema se necessário
CREATE SCHEMA IF NOT EXISTS public;

-- Configurações de timezone
SET timezone = 'America/Sao_Paulo';

-- Log de inicialização
\echo 'PostgreSQL initialized successfully for Task Manager! 🐘'