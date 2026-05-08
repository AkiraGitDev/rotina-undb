import { create } from 'zustand';

import { Project } from '@/types/project';

type ProjectsState = {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
};

// Store burro: só guarda o que vem do Firestore via subscribeProjects.
// Mutações são feitas direto pelos helpers em lib/projects-firestore.ts;
// o onSnapshot atualiza este array de volta automaticamente.
export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),
}));
