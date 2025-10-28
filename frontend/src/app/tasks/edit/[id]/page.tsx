"use client";

import { Alert, Button, Card, Header, createBreadcrumbs } from "@/components/ui";
import type { CreateTaskRequest, Task, UpdateTaskRequest } from "@/types";
import { useEffect, useState } from "react";

import { TaskForm } from "@/components/forms/task-form";
import { taskService } from "@/lib/api-services";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

interface EditTaskPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditTaskPage({ params }: EditTaskPageProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [taskId, setTaskId] = useState<string>("");
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingTask, setLoadingTask] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get params
  useEffect(() => {
    params.then((resolvedParams) => {
      setTaskId(resolvedParams.id);
    });
  }, [params]);

  // Verificar autenticação
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Carregar tarefa para edição
  useEffect(() => {
    if (taskId && user) {
      loadTask();
    }
  }, [taskId, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadTask = async () => {
    try {
      setLoadingTask(true);
      setError(null);
      const taskData = await taskService.getTaskById(taskId);
      setTask(taskData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar tarefa");
    } finally {
      setLoadingTask(false);
    }
  };

  const handleSubmit = async (taskData: CreateTaskRequest) => {
    if (!task) return;

    setLoading(true);
    setError(null);

    try {
      const updateData: UpdateTaskRequest = {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
      };

      await taskService.updateTask(task.id, updateData);
      router.push("/tasks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar tarefa");
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

  if (loadingTask) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Carregando...
              </h1>
            </div>
          </div>
        </header>
        <main className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </main>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">Erro</h1>
            </div>
          </div>
        </header>
        <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
          <Alert variant="error">{error}</Alert>
          <Button onClick={() => router.push("/tasks")} className="mt-4">
            Voltar para Tarefas
          </Button>
        </main>
      </div>
    );
  }

  const breadcrumbs = createBreadcrumbs([
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Tarefas', href: '/tasks' },
    { label: 'Editar Tarefa' },
  ]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header usando o componente reutilizável */}
      <Header 
        type="page" 
        breadcrumbs={breadcrumbs}
      />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card className="p-8 bg-slate-800/50 backdrop-blur border-slate-700/50">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-white">
                Editar Tarefa: {task?.title}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Modifique as informações da tarefa conforme necessário.
              </p>
            </div>

            {task && (
              <TaskForm
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
                initialData={{
                  title: task.title,
                  description: task.description || "",
                  priority: task.priority,
                  dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
                }}
              />
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
