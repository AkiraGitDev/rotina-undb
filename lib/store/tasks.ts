import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistStorage } from './storage';

import { Task, TaskPriority } from '@/types/task';

const seed: Task[] = [];

type CreateInput = {
  titulo: string;
  descricao?: string;
  projetoId: string;
  autorId: string;
  responsavelId?: string;
  prioridade?: TaskPriority;
  status?: Task['status'];
};

type TasksState = {
  tasks: Task[];
  createTask: (input: CreateInput) => Task;
  updateTask: (id: string, patch: Partial<Omit<Task, 'id'>>) => void;
  removeTask: (id: string) => void;
  approveTask: (id: string, prioridade: TaskPriority) => void;
  rejectTask: (id: string) => void;
  updateProgress: (id: string, cumprimento: number) => void;
  reset: () => void;
};

const today = () => new Date().toISOString().slice(0, 10);

export const useTasksStore = create<TasksState>()(
  persist(
    (set) => ({
      tasks: seed,
      createTask: (input) => {
        const nova: Task = {
          id: `t${Date.now()}`,
          titulo: input.titulo,
          descricao: input.descricao,
          projetoId: input.projetoId,
          autorId: input.autorId,
          responsavelId: input.responsavelId,
          prioridade: input.prioridade,
          status: input.status ?? 'pendente',
          cumprimento: 0,
          criadaEm: today(),
          atualizadaEm: today(),
        };
        set((state) => ({ tasks: [nova, ...state.tasks] }));
        return nova;
      },
      updateTask: (id, patch) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...patch, atualizadaEm: today() } : t)),
        })),
      removeTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
      approveTask: (id, prioridade) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status: 'aprovada', prioridade, atualizadaEm: today() } : t,
          ),
        })),
      rejectTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, status: 'rejeitada', atualizadaEm: today() } : t)),
        })),
      updateProgress: (id, cumprimento) => {
        const clamped = Math.max(0, Math.min(100, cumprimento));
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== id) return t;
            const status = clamped === 100 ? 'concluida' : t.status === 'aprovada' ? 'em_andamento' : t.status;
            return { ...t, cumprimento: clamped, status, atualizadaEm: today() };
          }),
        }));
      },
      reset: () => set({ tasks: [] }),
    }),
    {
      name: 'rotina:tasks',
      storage: persistStorage,
    },
  ),
);
