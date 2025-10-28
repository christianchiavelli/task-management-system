"use client";

import { Alert, Button, Input } from "@/components/ui";

import type { CreateTaskRequest } from "@/types";
import { useState } from "react";

interface TaskFormProps {
  onSubmit: (taskData: CreateTaskRequest) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  initialData?: Partial<CreateTaskRequest>;
}

export function TaskForm({
  onSubmit,
  loading = false,
  error,
  initialData,
}: TaskFormProps) {
  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    priority: initialData?.priority || "medium",
    dueDate: initialData?.dueDate || "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Título é obrigatório";
    }

    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        errors.dueDate = "Data de vencimento não pode ser no passado";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch {
      // Error handling is done in the parent component
    }
  };

  const handleInputChange =
    (field: keyof CreateTaskRequest) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      // Clear validation error when user starts typing
      if (validationErrors[field]) {
        setValidationErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert variant="error">{error}</Alert>}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Título *
        </label>
        <Input
          id="title"
          type="text"
          value={formData.title}
          onChange={handleInputChange("title")}
          className={validationErrors.title ? "border-red-500" : ""}
          placeholder="Digite o título da tarefa"
          autoComplete="off"
        />
        {validationErrors.title && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Descrição
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={handleInputChange("description")}
          rows={4}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Descreva os detalhes da tarefa (opcional)"
        />
      </div>

      <div>
        <label
          htmlFor="priority"
          className="block text-sm font-medium text-gray-700"
        >
          Prioridade
        </label>
        <select
          id="priority"
          value={formData.priority}
          onChange={handleInputChange("priority")}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="low">Baixa</option>
          <option value="medium">Média</option>
          <option value="high">Alta</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="dueDate"
          className="block text-sm font-medium text-gray-700"
        >
          Data de Vencimento
        </label>
        <Input
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleInputChange("dueDate")}
          className={validationErrors.dueDate ? "border-red-500" : ""}
          autoComplete="off"
        />
        {validationErrors.dueDate && (
          <p className="mt-1 text-sm text-red-600">
            {validationErrors.dueDate}
          </p>
        )}
      </div>

      <div className="flex space-x-4 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Salvando..." : "Salvar Tarefa"}
        </Button>
      </div>
    </form>
  );
}
