import { PRIORITY_WEIGHT, Task } from '@/types/task';

export function projectProgress(tasks: Task[]): number {
  const relevant = tasks.filter((t) => t.status === 'aprovada' || t.status === 'em_andamento' || t.status === 'concluida');
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
