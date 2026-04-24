export type TaskPriority = 'baixa' | 'media' | 'alta' | 'critica';

export type TaskStatus =
  | 'rascunho'
  | 'pendente'
  | 'aprovada'
  | 'rejeitada'
  | 'em_andamento'
  | 'concluida';

export const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  baixa: 1,
  media: 2,
  alta: 3,
  critica: 4,
};

export type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  projetoId: string;
  autorId: string;
  responsavelId?: string;
  status: TaskStatus;
  prioridade?: TaskPriority;
  cumprimento: number;
  criadaEm: string;
  atualizadaEm: string;
};
