import { useProjectsStore } from './projects';
import { useTasksStore } from './tasks';

import { signOutCurrent } from '@/lib/auth';

// Apaga só projetos e tarefas locais + faz signOut do Firebase.
// Users vivem no Firestore agora — pra apagar de verdade tem que ir
// no console.firebase.google.com → Firestore → users (collection).
export async function resetAllStores(): Promise<void> {
  await Promise.all([
    useProjectsStore.persist.clearStorage(),
    useTasksStore.persist.clearStorage(),
  ]);
  useProjectsStore.getState().reset();
  useTasksStore.getState().reset();
  await signOutCurrent();
}
