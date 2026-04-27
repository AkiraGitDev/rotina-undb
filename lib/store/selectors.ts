import { useProjectsStore } from './projects';
import { useTasksStore } from './tasks';
import { useUsersStore } from './users';

import { Project } from '@/types/project';
import { PRIORITY_WEIGHT, Task } from '@/types/task';
import { User } from '@/types/user';

export function useTasksOfProject(projectId: string): Task[] {
  return useTasksStore((s) => s.tasks.filter((t) => t.projetoId === projectId));
}

export function useTasksOfUser(userId: string): Task[] {
  return useTasksStore((s) => s.tasks.filter((t) => t.responsavelId === userId));
}

export function usePendingTasks(): Task[] {
  return useTasksStore((s) => s.tasks.filter((t) => t.status === 'pendente'));
}

export function useProjectsOfUser(userId: string): Project[] {
  return useProjectsStore((s) => s.projects.filter((p) => p.membroIds.includes(userId)));
}

export function useUserById(id?: string): User | undefined {
  return useUsersStore((s) => (id ? s.users.find((u) => u.id === id) : undefined));
}

export function useProjectById(id?: string): Project | undefined {
  return useProjectsStore((s) => (id ? s.projects.find((p) => p.id === id) : undefined));
}

export function useTaskById(id?: string): Task | undefined {
  return useTasksStore((s) => (id ? s.tasks.find((t) => t.id === id) : undefined));
}

export function projectProgress(tasks: Task[]): number {
  const relevant = tasks.filter(
    (t) => t.status === 'aprovada' || t.status === 'em_andamento' || t.status === 'concluida',
  );
  if (relevant.length === 0) return 0;
  let somaPonderada = 0;
  let somaPesos = 0;
  for (const t of relevant) {
    const peso = t.prioridade ? PRIORITY_WEIGHT[t.prioridade] : 1;
    somaPonderada += peso * t.cumprimento;
    somaPesos += peso;
  }
  if (somaPesos === 0) return 0;
  return Math.round(somaPonderada / somaPesos);
}

export function userProgress(tasks: Task[]): number {
  const ativas = tasks.filter((t) => t.status === 'aprovada' || t.status === 'em_andamento' || t.status === 'concluida');
  return projectProgress(ativas);
}
