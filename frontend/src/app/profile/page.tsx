"use client";

import { Alert, Button, Card, Header, Input, createBreadcrumbs } from "@/components/ui";
import { useEffect, useState } from "react";

import { formatDate } from "@/utils/date";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { userService } from "@/lib/api-services";

export default function ProfilePage() {
  const { user, loading: authLoading, updateUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  // Verificar autenticação
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Carregar dados do usuário
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedUser = await userService.updateProfile({
        name: formData.name,
        email: formData.email,
      });

      updateUser(updatedUser);
      setSuccess("Perfil atualizado com sucesso!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange =
    (field: "name" | "email") => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const breadcrumbs = createBreadcrumbs([
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Meu Perfil' },
  ]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header usando o componente reutilizável */}
      <Header 
        type="page" 
        breadcrumbs={breadcrumbs}
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1 flex flex-col h-full">
            <Card className="p-6 bg-slate-800/50 backdrop-blur border-slate-700/50 flex-1">
              <div className="text-center h-full flex flex-col justify-center">
                {/* Avatar placeholder */}
                <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-600 rounded-full mb-4 mx-auto">
                  <span className="text-2xl font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-white mb-1">{user.name}</h2>
                <p className="text-slate-400 mb-4">{user.email}</p>
                <div className="flex items-center justify-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === "admin" 
                      ? "bg-purple-600/20 text-purple-400" 
                      : "bg-blue-600/20 text-blue-400"
                  }`}>
                    {user.role === "admin" ? "Administrador" : "Usuário"}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.isActive 
                      ? "bg-green-600/20 text-green-400" 
                      : "bg-red-600/20 text-red-400"
                  }`}>
                    {user.isActive ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>
            </Card>

            {/* Account Info */}
            <Card className="p-6 bg-slate-800/50 backdrop-blur border-slate-700/50 mt-6 flex-1">
              <h3 className="text-lg font-semibold text-white mb-4">Informações da Conta</h3>
              <div className="space-y-4 h-full flex flex-col justify-center">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Conta criada:</span>
                  <span className="text-sm text-white text-right">{formatDate(user.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Última atualização:</span>
                  <span className="text-sm text-white text-right">Não informado</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 flex flex-col space-y-6">
            {/* Edit Profile */}
            <Card className="p-6 bg-slate-800/50 backdrop-blur border-slate-700/50 flex-1">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Editar Perfil
              </h3>

              {error && (
                <Alert variant="error" className="mb-4">
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success" className="mb-4">
                  {success}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                    Nome Completo
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange("name")}
                    placeholder="Seu nome completo"
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400"
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    placeholder="seu@email.com"
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400"
                    autoComplete="email"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
              </form>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-slate-800/50 backdrop-blur border-slate-700/50 flex-1">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Ações Rápidas
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/tasks")}
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 py-3"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  Ver Minhas Tarefas
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push("/tasks/new")}
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 py-3"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Criar Nova Tarefa
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
