'use client';

import { Alert, Button, Input } from '@/components/ui';

import { authService } from '@/lib/api-services';
import { useAuth } from '@/contexts/auth-context';
import { useState } from 'react';

export default function AdminCreateUserPage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Loading state - enquanto o auth ainda está carregando
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Verificação de permissão - só executa depois que o loading acabou
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Acesso Negado</h1>
          <p className="text-slate-400">Apenas administradores podem acessar esta página.</p>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email) {
      errors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      errors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      setSuccess(`Usuário ${formData.name} criado com sucesso!`);
      
      // Limpar formulário
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user',
      });
      setValidationErrors({});

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar usuário');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Limpar erro específico quando usuario começar a digitar
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header com navegação */}
      <header className="backdrop-blur-md bg-slate-800/50 border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            {/* Botão Voltar */}
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Voltar
            </button>
            
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm">
              <a 
                href="/dashboard" 
                className="text-slate-400 hover:text-white transition-colors"
              >
                Dashboard
              </a>
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
              <a 
                href="/admin/users" 
                className="text-slate-400 hover:text-white transition-colors"
              >
                Gerenciar Usuários
              </a>
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
              <span className="text-emerald-400 font-medium">Novo Usuário</span>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header da página */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Criar Novo Usuário</h1>
            <p className="text-slate-400">
              Adicione um novo usuário ao sistema e defina suas permissões
            </p>
          </div>

          {/* Formulário */}
          <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-8">
            {error && (
              <Alert variant="error" className="mb-6">
                {error}
              </Alert>
            )}

            {success && (
              <Alert variant="success" className="mb-6">
                <div className="flex items-center justify-between">
                  <span>{success}</span>
                  <button
                    onClick={() => window.location.href = '/admin/users'}
                    className="text-green-700 hover:text-green-600 font-medium"
                  >
                    Ver todos os usuários →
                  </button>
                </div>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Nome completo *
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  className={`bg-slate-700 border-slate-600 text-white ${validationErrors.name ? 'border-red-500' : ''}`}
                  placeholder="Nome do usuário"
                  autoComplete="name"
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email *
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  className={`bg-slate-700 border-slate-600 text-white ${validationErrors.email ? 'border-red-500' : ''}`}
                  placeholder="email@exemplo.com"
                  autoComplete="email"
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Senha *
                </label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  className={`bg-slate-700 border-slate-600 text-white ${validationErrors.password ? 'border-red-500' : ''}`}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                />
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-2">
                  Função no sistema *
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={handleInputChange('role')}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="user">Usuário - Acesso padrão</option>
                  <option value="admin">Administrador - Acesso total</option>
                </select>
                <p className="mt-1 text-xs text-slate-500">
                  {formData.role === 'admin' 
                    ? 'Administradores podem gerenciar usuários e ter acesso total ao sistema'
                    : 'Usuários têm acesso apenas às suas próprias tarefas e perfil'
                  }
                </p>
              </div>

              <div className="flex space-x-4 pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Criando...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                      Criar Usuário
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => window.location.href = '/admin/users'}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}