/**
 * Formata uma data de forma segura para exibição
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) {
    return "Não informado";
  }

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Verificar se a data é válida
    if (isNaN(dateObj.getTime())) {
      return "Data inválida";
    }

    return dateObj.toLocaleDateString("pt-BR");
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "Data inválida";
  }
}

/**
 * Formata uma data com horário de forma segura
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) {
    return "Não informado";
  }

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Verificar se a data é válida
    if (isNaN(dateObj.getTime())) {
      return "Data inválida";
    }

    return dateObj.toLocaleString("pt-BR");
  } catch (error) {
    console.error("Erro ao formatar data e hora:", error);
    return "Data inválida";
  }
}

/**
 * Formata data relativa (ex: "há 2 dias")
 */
export function formatRelativeDate(
  date: string | Date | null | undefined
): string {
  if (!date) {
    return "Não informado";
  }

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Verificar se a data é válida
    if (isNaN(dateObj.getTime())) {
      return "Data inválida";
    }

    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `há ${diffDays} dia${diffDays > 1 ? "s" : ""}`;
    } else if (diffHours > 0) {
      return `há ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
    } else if (diffMinutes > 0) {
      return `há ${diffMinutes} minuto${diffMinutes > 1 ? "s" : ""}`;
    } else {
      return "agora mesmo";
    }
  } catch (error) {
    console.error("Erro ao calcular data relativa:", error);
    return "Data inválida";
  }
}
