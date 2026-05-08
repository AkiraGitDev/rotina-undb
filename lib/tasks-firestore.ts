import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import { Task, TaskPriority, TaskStatus } from '@/types/task';

type TaskDoc = {
  titulo: string;
  descricao?: string;
  projetoId: string;
  autorId: string;
  responsavelId?: string;
  status: TaskStatus;
  prioridade?: TaskPriority;
  cumprimento: number;
  createdAt?: FirebaseFirestoreTypes.Timestamp;
  updatedAt?: FirebaseFirestoreTypes.Timestamp;
};

function docToTask(id: string, data: TaskDoc): Task {
  return {
    id,
    titulo: data.titulo,
    descricao: data.descricao,
    projetoId: data.projetoId,
    autorId: data.autorId,
    responsavelId: data.responsavelId,
    status: data.status,
    prioridade: data.prioridade,
    cumprimento: data.cumprimento ?? 0,
    criadaEm: data.createdAt?.toDate().toISOString().slice(0, 10) ?? '',
    atualizadaEm: data.updatedAt?.toDate().toISOString().slice(0, 10) ?? '',
  };
}

export function subscribeTasks(cb: (tasks: Task[]) => void): () => void {
  return firestore()
    .collection('tasks')
    .onSnapshot(
      (snap) => {
        if (!snap) return;
        const tasks = snap.docs.map((d) => docToTask(d.id, d.data() as TaskDoc));
        cb(tasks);
      },
      (error) => {
        console.warn('[tasks-firestore] onSnapshot error:', error);
      },
    );
}

type CreateInput = {
  titulo: string;
  descricao?: string;
  projetoId: string;
  autorId: string;
  responsavelId?: string;
  prioridade?: TaskPriority;
  status?: TaskStatus;
};

export async function createTask(input: CreateInput): Promise<string> {
  const payload: Record<string, unknown> = {
    titulo: input.titulo,
    projetoId: input.projetoId,
    autorId: input.autorId,
    status: input.status ?? 'pendente',
    cumprimento: 0,
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  };
  if (input.descricao) payload.descricao = input.descricao;
  if (input.responsavelId) payload.responsavelId = input.responsavelId;
  if (input.prioridade) payload.prioridade = input.prioridade;

  const ref = await firestore().collection('tasks').add(payload);
  return ref.id;
}

export async function updateTask(
  id: string,
  patch: Partial<Omit<Task, 'id' | 'criadaEm' | 'atualizadaEm'>>,
): Promise<void> {
  const clean: Record<string, unknown> = { updatedAt: firestore.FieldValue.serverTimestamp() };
  for (const [k, v] of Object.entries(patch)) {
    if (v !== undefined) clean[k] = v;
  }
  await firestore().collection('tasks').doc(id).update(clean);
}

export async function removeTask(id: string): Promise<void> {
  await firestore().collection('tasks').doc(id).delete();
}

// Apaga todas as tarefas de um projeto. Usado quando o projeto é removido.
// Em escala, o ideal seria uma Cloud Function (onProjectDelete) — pra demo,
// faz batch no client.
export async function removeTasksOfProject(projectId: string): Promise<void> {
  const snap = await firestore().collection('tasks').where('projetoId', '==', projectId).get();
  if (snap.empty) return;
  const batch = firestore().batch();
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}

export async function approveTask(id: string, prioridade: TaskPriority): Promise<void> {
  await firestore().collection('tasks').doc(id).update({
    status: 'aprovada',
    prioridade,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
}

export async function rejectTask(id: string): Promise<void> {
  await firestore().collection('tasks').doc(id).update({
    status: 'rejeitada',
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
}

export async function updateProgress(id: string, cumprimento: number, currentStatus: TaskStatus): Promise<void> {
  const clamped = Math.max(0, Math.min(100, cumprimento));
  // Promove status: aprovada → em_andamento ao mexer; qualquer status → concluida em 100%
  let nextStatus: TaskStatus = currentStatus;
  if (clamped === 100) nextStatus = 'concluida';
  else if (currentStatus === 'aprovada') nextStatus = 'em_andamento';

  await firestore().collection('tasks').doc(id).update({
    cumprimento: clamped,
    status: nextStatus,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
}
