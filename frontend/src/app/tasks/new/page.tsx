"use client";

import { Button, Card, Header, createBreadcrumbs } from "@/components/ui";
import { useEffect, useState } from "react";

import type { CreateTaskRequest } from "@/types";
import { TaskForm } from "@/components/forms/task-form";
import { taskService } from "@/lib/api-services";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function NewTaskPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar autenticação
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (taskData: CreateTaskRequest) => {
    setLoading(true);
    setError(null);

    try {
      await taskService.createTask(taskData);
      router.push("/tasks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar tarefa");
    } finally {
      setLoading(false);
    }
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
    { label: 'Tarefas', href: '/tasks' },
    { label: 'Nova Tarefa' },
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
          {/* Sidebar compacta e elegante */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-slate-800/50 backdrop-blur border-slate-700/50 h-full flex flex-col">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                Dicas Rápidas
              </h3>
              
              {/* Conteúdo das dicas que cresce */}
              <div className="flex-1 flex flex-col">
                <div className="space-y-5 flex-1">
                  {/* Dica 1 */}
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-300">Título claro</p>
                      <p className="text-xs text-slate-400 leading-relaxed">Use descrições específicas e objetivas</p>
                    </div>
                  </div>

                  {/* Dica 2 */}
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-300">Prioridade certa</p>
                      <p className="text-xs text-slate-400 leading-relaxed">Organize por importância e urgência</p>
                    </div>
                  </div>

                  {/* Dica 3 */}
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-300">Prazo realista</p>
                      <p className="text-xs text-slate-400 leading-relaxed">Considere tempo extra para imprevistos</p>
                    </div>
                  </div>

                  {/* Dica 4 */}
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-300">Descrição útil</p>
                      <p className="text-xs text-slate-400 leading-relaxed">Adicione contexto e requisitos necessários</p>
                    </div>
                  </div>
                </div>

                {/* Dica destaque sempre no final */}
                <div className="mt-6 p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <svg className="w-4 h-4 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <span className="text-sm font-medium text-blue-400">Dica Pro</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Quebre tarefas grandes em partes menores para melhor acompanhamento e sensação de progresso
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Formulário */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-slate-800/50 backdrop-blur border-slate-700/50 h-full">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2 flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Criar Nova Tarefa
                </h2>
                <p className="text-slate-400 text-sm">
                  Preencha os campos abaixo para organizar seu trabalho
                </p>
              </div>

              <TaskForm onSubmit={handleSubmit} loading={loading} error={error} />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
