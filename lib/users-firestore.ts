import firestore from '@react-native-firebase/firestore';

import { FirestoreUserDoc } from './auth';

import { User, UserRole } from '@/types/user';

// Converte um doc do Firestore (uid + dados) para o tipo User usado na UI.
function docToUser(uid: string, data: FirestoreUserDoc): User {
  return {
    id: uid,
    nome: data.nome,
    email: data.email,
    role: data.role,
    avatarColor: data.avatarColor,
  };
}

// Subscribe à coleção inteira de usuários. Toda vez que qualquer doc muda,
// o callback é chamado com a lista nova. Retorna função pra desinscrever.
export function subscribeUsers(cb: (users: User[]) => void): () => void {
  return firestore()
    .collection('users')
    .onSnapshot(
      (snap) => {
        if (!snap) return;
        const users = snap.docs.map((d) => docToUser(d.id, d.data() as FirestoreUserDoc));
        cb(users);
      },
      (error) => {
        // Em produção mandaria pra tracking. Pra demo, log basta.
        console.warn('[users-firestore] onSnapshot error:', error);
      },
    );
}

export async function setUserRole(uid: string, role: UserRole): Promise<void> {
  await firestore().collection('users').doc(uid).update({ role });
}

export async function removeUserDoc(uid: string): Promise<void> {
  await firestore().collection('users').doc(uid).delete();
}

export async function createColaboradorDoc(
  uid: string,
  nome: string,
  email: string,
  avatarColor: string,
): Promise<void> {
  await firestore()
    .collection('users')
    .doc(uid)
    .set({
      nome,
      email,
      role: 'colaborador',
      avatarColor,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
}
