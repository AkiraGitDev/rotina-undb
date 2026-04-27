import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistStorage } from './storage';

import { Project } from '@/types/project';

const seed: Project[] = [
  { id: 'p1', nome: 'App Rotina', descricao: 'App interno de gestão', emoji: '📱', membroIds: ['u1', 'u2', 'u3'], criadoEm: '2026-03-01' },
  { id: 'p2', nome: 'Site institucional', descricao: 'Rebranding completo', emoji: '🚀', membroIds: ['u1', 'u4'], criadoEm: '2026-03-10' },
  { id: 'p3', nome: 'Integração ERP', emoji: '✨', membroIds: ['u1', 'u2', 'u4'], criadoEm: '2026-04-05' },
];

type ProjectsState = {
  projects: Project[];
  createProject: (input: Omit<Project, 'id' | 'criadoEm'>) => Project;
  updateProject: (id: string, patch: Partial<Omit<Project, 'id'>>) => void;
  removeProject: (id: string) => void;
  reset: () => void;
};

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set) => ({
      projects: seed,
      createProject: (input) => {
        const novo: Project = { ...input, id: `p${Date.now()}`, criadoEm: new Date().toISOString().slice(0, 10) };
        set((state) => ({ projects: [...state.projects, novo] }));
        return novo;
      },
      updateProject: (id, patch) =>
        set((state) => ({ projects: state.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      removeProject: (id) =>
        set((state) => ({ projects: state.projects.filter((p) => p.id !== id) })),
      reset: () => set({ projects: seed }),
    }),
    {
      name: 'rotina:projects',
      storage: persistStorage,
    },
  ),
);
