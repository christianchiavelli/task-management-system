'use client';

import type { UpdateUserData, User } from '@/types';
import { useCallback, useState } from 'react';

import { tokenUtils } from '@/lib/api-client';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = async (endpoint: string, options: RequestInit = {}) => {
    const token = tokenUtils.get();
    const response = await fetch(`http://localhost:3001${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(errorData.message || `Erro ${response.status}`);
    }

    return response.json();
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await api('/users');
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar usuários');
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array porque api não muda

  const getUserById = async (id: string): Promise<User | null> => {
    try {
      return await api(`/users/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar usuário');
      return null;
    }
  };

  const updateUser = async (id: string, data: UpdateUserData): Promise<boolean> => {
    try {
      const updatedUser = await api(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });

      // Atualiza a lista local
      setUsers(prev => prev.map(user => 
        user.id === id ? { ...user, ...updatedUser } : user
      ));

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar usuário');
      return false;
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      await api(`/users/${id}`, {
        method: 'DELETE',
      });

      // Remove da lista local
      setUsers(prev => prev.filter(user => user.id !== id));

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar usuário');
      return false;
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    getUserById,
    updateUser,
    deleteUser,
    clearError: () => setError(null),
  };
}