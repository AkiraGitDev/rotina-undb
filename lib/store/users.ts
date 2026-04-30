import { create } from 'zustand';

import { Colors } from '@/constants/theme';
import { User } from '@/types/user';

// Sentinel pra renderizar tranquilamente quando ninguém está logado ou
// enquanto a primeira sincronização do Firestore não terminou.
const ANONYMOUS_USER: User = {
  id: '',
  nome: '—',
  email: '',
  role: 'colaborador',
  avatarColor: Colors.midnightViolet,
};

type UsersState = {
  users: User[];
  currentUserId: string;
  setUsers: (users: User[]) => void;
  setCurrentUser: (id: string) => void;
};

// Store agora é "burro": só guarda o que vem do Firebase. Mutações reais
// (criar/editar/remover usuário, mudar role) acontecem direto no Firestore
// via lib/users-firestore.ts; o onSnapshot atualiza este store de volta.
export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  currentUserId: '',
  setUsers: (users) => set({ users }),
  setCurrentUser: (id) => set({ currentUserId: id }),
}));

export function useCurrentUser(): User {
  const users = useUsersStore((s) => s.users);
  const id = useUsersStore((s) => s.currentUserId);
  return users.find((u) => u.id === id) ?? ANONYMOUS_USER;
}
