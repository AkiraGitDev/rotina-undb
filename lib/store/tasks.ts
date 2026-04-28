import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistStorage } from './storage';

import { Task, TaskPriority } from '@/types/task';

const seed: Task[] = [
  { id: 't1', titulo: 'Implementar login', projetoId: 'p1', autorId: 'u2', responsavelId: 'u2', status: 'em_andamento', prioridade: 'alta', cumprimento: 80, criadaEm: '2026-04-10', atualizadaEm: '2026-04-22' },
  { id: 't2', titulo: 'Desenhar dashboard', projetoId: 'p1', autorId: 'u1', responsavelId: 'u3', status: 'concluida', prioridade: 'media', cumprimento: 100, criadaEm: '2026-04-05', atualizadaEm: '2026-04-20' },
  { id: 't3', titulo: 'Configurar CI/CD', projetoId: 'p1', autorId: 'u2', responsavelId: 'u2', status: 'pendente', cumprimento: 0, criadaEm: '2026-04-23', atualizadaEm: '2026-04-23' },
  { id: 't4', titulo: 'Migrar landing page', projetoId: 'p2', autorId: 'u4', responsavelId: 'u4', status: 'em_andamento', prioridade: 'critica', cumprimento: 45, criadaEm: '2026-04-12', atualizadaEm: '2026-04-23' },
  { id: 't5', titulo: 'Refazer hero section', projetoId: 'p2', autorId: 'u4', responsavelId: 'u4', status: 'pendente', cumprimento: 0, criadaEm: '2026-04-24', atualizadaEm: '2026-04-24' },
  { id: 't6', titulo: 'Mapear endpoints ERP', projetoId: 'p3', autorId: 'u2', responsavelId: 'u2', status: 'aprovada', prioridade: 'alta', cumprimento: 20, criadaEm: '2026-04-15', atualizadaEm: '2026-04-22' },
  { id: 't7', titulo: 'POC integração SAP', projetoId: 'p3', autorId: 'u4', responsavelId: 'u4', status: 'em_andamento', prioridade: 'media', cumprimento: 30, criadaEm: '2026-04-18', atualizadaEm: '2026-04-23' },
  { id: 't8', titulo: 'Revisar escopo do módulo financeiro', projetoId: 'p3', autorId: 'u4', responsavelId: 'u4', status: 'pendente', cumprimento: 0, criadaEm: '2026-04-24', atualizadaEm: '2026-04-24' },
];

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
