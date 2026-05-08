import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import { Project } from '@/types/project';

// Estrutura do doc no Firestore — basicamente igual ao Project,
// mas sem o `id` (que é o doc.id) e com Timestamp em vez de string.
type ProjectDoc = {
  nome: string;
  descricao?: string;
  emoji: string;
  membroIds: string[];
  createdAt?: FirebaseFirestoreTypes.Timestamp;
};

function docToProject(id: string, data: ProjectDoc): Project {
  return {
    id,
    nome: data.nome,
    descricao: data.descricao,
    emoji: data.emoji,
    membroIds: data.membroIds ?? [],
    criadoEm: data.createdAt?.toDate().toISOString().slice(0, 10) ?? '',
  };
}

export function subscribeProjects(cb: (projects: Project[]) => void): () => void {
  return firestore()
    .collection('projects')
    .onSnapshot(
      (snap) => {
        if (!snap) return;
        const projects = snap.docs.map((d) => docToProject(d.id, d.data() as ProjectDoc));
        cb(projects);
      },
      (error) => {
        console.warn('[projects-firestore] onSnapshot error:', error);
      },
    );
}

export async function createProject(input: Omit<Project, 'id' | 'criadoEm'>): Promise<string> {
  const ref = await firestore()
    .collection('projects')
    .add({
      nome: input.nome,
      descricao: input.descricao ?? null,
      emoji: input.emoji,
      membroIds: input.membroIds,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  return ref.id;
}

export async function updateProject(
  id: string,
  patch: Partial<Omit<Project, 'id' | 'criadoEm'>>,
): Promise<void> {
  // Filtra undefined pra não sobrescrever campos com null acidentalmente
  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(patch)) {
    if (v !== undefined) clean[k] = v;
  }
  await firestore().collection('projects').doc(id).update(clean);
}

export async function removeProject(id: string): Promise<void> {
  await firestore().collection('projects').doc(id).delete();
}
