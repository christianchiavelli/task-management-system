"use client";

import {
  Alert,
  Button,
  Card,
  Header,
  Input,
  createBreadcrumbs,
} from "@/components/ui";
import { useEffect, useState } from "react";

import type { Task } from "@/types";
import { formatDate } from "@/utils/date";
import { taskService } from "@/lib/api-services";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

const statusColors = {
  pending: "bg-yellow-600/20 text-yellow-400",
  in_progress: "bg-blue-600/20 text-blue-400",
  completed: "bg-green-600/20 text-green-400",
};

const priorityColors = {
  low: "bg-slate-600/20 text-slate-400",
  medium: "bg-orange-600/20 text-orange-400",
  high: "bg-red-600/20 text-red-400",
};

const statusLabels = {
  pending: "Pendente",
  in_progress: "Em Progresso",
  completed: "Concluída",
};

const priorityLabels = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

export default function TasksPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "in_progress" | "completed"
  >("all");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const userTasks = await taskService.getTasks();
      setTasks(userTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar tarefas");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    taskId: string,
    newStatus: Task["status"]
  ) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar tarefa");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) {
      return;
    }

    try {
      await taskService.deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir tarefa");
      await loadTasks();
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const breadcrumbs = createBreadcrumbs([
    { label: "Dashboard", href: "/dashboard" },
    { label: "Minhas Tarefas" },
  ]);

  const rightContent = (
    <Button
      onClick={() => router.push("/tasks/new")}
      className="bg-blue-600 hover:bg-blue-700"
    >
      + Nova Tarefa
    </Button>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header usando o componente reutilizável */}
      <Header
        type="page"
        breadcrumbs={breadcrumbs}
        rightContent={rightContent}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          {/* Filters */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-6 rounded-lg mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Pesquisar tarefas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value as
                        | "all"
                        | "pending"
                        | "in_progress"
                        | "completed"
                    )
                  }
                  className="block w-full rounded-md bg-slate-700 border-slate-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="all">Todos os status</option>
                  <option value="pending">Pendente</option>
                  <option value="in_progress">Em Progresso</option>
                  <option value="completed">Concluída</option>
                </select>
              </div>
            </div>
          </div>

          {/* Task List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <Card className="text-center py-12 bg-slate-800/50 backdrop-blur border-slate-700/50">
              <p className="text-slate-400 text-lg">
                {searchTerm || statusFilter !== "all"
                  ? "Nenhuma tarefa encontrada com os filtros aplicados"
                  : "Você ainda não tem tarefas"}
              </p>
              <Button
                onClick={() => router.push("/tasks/new")}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                Criar primeira tarefa
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <Card
                  key={task.id}
                  className="p-6 bg-slate-800/50 backdrop-blur border-slate-700/50"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {task.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[task.status]
                          }`}
                        >
                          {statusLabels[task.status]}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            priorityColors[task.priority]
                          }`}
                        >
                          {priorityLabels[task.priority]}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-slate-300 mb-3">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-slate-400">
                        <span>Criada: {formatDate(task.createdAt)}</span>
                        {task.dueDate && (
                          <span>Prazo: {formatDate(task.dueDate)}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {/* Status Actions */}
                      {task.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusChange(task.id, "in_progress")
                          }
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Iniciar
                        </Button>
                      )}

                      {task.status === "in_progress" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusChange(task.id, "completed")
                          }
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Concluir
                        </Button>
                      )}

                      {task.status === "completed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatusChange(task.id, "in_progress")
                          }
                        >
                          Reabrir
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/tasks/edit/${task.id}`)}
                      >
                        Editar
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
