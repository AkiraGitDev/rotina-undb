import { Project } from '@/types/project';
import { Task } from '@/types/task';
import { User } from '@/types/user';

import { Colors } from '@/constants/theme';

export const currentUser: User = {
  id: 'u1',
  nome: 'Maria Silva',
  email: 'maria@acme.com',
  role: 'admin',
  avatarColor: Colors.raspberryPlum,
};

export const mockUsers: User[] = [
  currentUser,
  { id: 'u2', nome: 'João Pedro', email: 'joao@acme.com', role: 'colaborador', avatarColor: Colors.midnightViolet },
  { id: 'u3', nome: 'Ana Costa', email: 'ana@acme.com', role: 'colaborador', avatarColor: Colors.racingRed },
  { id: 'u4', nome: 'Rafael Dias', email: 'rafael@acme.com', role: 'colaborador', avatarColor: '#2D3A50' },
];

export const mockProjects: Project[] = [
  { id: 'p1', nome: 'App Rotina', descricao: 'App interno de gestão', emoji: '📱', membroIds: ['u1', 'u2', 'u3'], criadoEm: '2026-03-01' },
  { id: 'p2', nome: 'Site institucional', descricao: 'Rebranding completo', emoji: '🚀', membroIds: ['u1', 'u4'], criadoEm: '2026-03-10' },
  { id: 'p3', nome: 'Integração ERP', emoji: '✨', membroIds: ['u1', 'u2', 'u4'], criadoEm: '2026-04-05' },
];

export const mockTasks: Task[] = [
  { id: 't1', titulo: 'Implementar login', projetoId: 'p1', autorId: 'u2', responsavelId: 'u2', status: 'em_andamento', prioridade: 'alta', cumprimento: 80, criadaEm: '2026-04-10', atualizadaEm: '2026-04-22' },
  { id: 't2', titulo: 'Desenhar dashboard', projetoId: 'p1', autorId: 'u1', responsavelId: 'u3', status: 'concluida', prioridade: 'media', cumprimento: 100, criadaEm: '2026-04-05', atualizadaEm: '2026-04-20' },
  { id: 't3', titulo: 'Configurar CI/CD', projetoId: 'p1', autorId: 'u2', responsavelId: 'u2', status: 'pendente', cumprimento: 0, criadaEm: '2026-04-23', atualizadaEm: '2026-04-23' },
  { id: 't4', titulo: 'Migrar landing page', projetoId: 'p2', autorId: 'u4', responsavelId: 'u4', status: 'em_andamento', prioridade: 'critica', cumprimento: 45, criadaEm: '2026-04-12', atualizadaEm: '2026-04-23' },
  { id: 't5', titulo: 'Refazer hero section', projetoId: 'p2', autorId: 'u4', responsavelId: 'u4', status: 'pendente', cumprimento: 0, criadaEm: '2026-04-24', atualizadaEm: '2026-04-24' },
  { id: 't6', titulo: 'Mapear endpoints ERP', projetoId: 'p3', autorId: 'u2', responsavelId: 'u2', status: 'aprovada', prioridade: 'alta', cumprimento: 20, criadaEm: '2026-04-15', atualizadaEm: '2026-04-22' },
  { id: 't7', titulo: 'POC integração SAP', projetoId: 'p3', autorId: 'u4', responsavelId: 'u4', status: 'em_andamento', prioridade: 'media', cumprimento: 30, criadaEm: '2026-04-18', atualizadaEm: '2026-04-23' },
  { id: 't8', titulo: 'Revisar escopo do módulo financeiro', projetoId: 'p3', autorId: 'u4', responsavelId: 'u4', status: 'pendente', cumprimento: 0, criadaEm: '2026-04-24', atualizadaEm: '2026-04-24' },
];

export function tasksOfProject(projectId: string): Task[] {
  return mockTasks.filter((t) => t.projetoId === projectId);
}

export function pendingTasks(): Task[] {
  return mockTasks.filter((t) => t.status === 'pendente');
}

export function tasksOfUser(userId: string): Task[] {
  return mockTasks.filter((t) => t.responsavelId === userId);
}

export function projectsOfUser(userId: string): Project[] {
  return mockProjects.filter((p) => p.membroIds.includes(userId));
}
