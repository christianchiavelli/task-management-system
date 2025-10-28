// Utilitários gerais

// Merge de classes
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

// Formatação de datas
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

// Utilitários de status
export function getStatusColor(
  status: "pending" | "in_progress" | "completed"
): string {
  const colors = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    in_progress:
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    completed:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  };
  return colors[status];
}

export function getPriorityColor(priority: "low" | "medium" | "high"): string {
  const colors = {
    low: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    medium:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };
  return colors[priority];
}

// Tradução de status e prioridades
export function translateStatus(
  status: "pending" | "in_progress" | "completed"
): string {
  const translations = {
    pending: "Pendente",
    in_progress: "Em Progresso",
    completed: "Concluída",
  };
  return translations[status];
}

export function translatePriority(priority: "low" | "medium" | "high"): string {
  const translations = {
    low: "Baixa",
    medium: "Média",
    high: "Alta",
  };
  return translations[priority];
}
