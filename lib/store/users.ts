import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistStorage } from './storage';

import { Colors } from '@/constants/theme';
import { User, UserRole } from '@/types/user';

const seed: User[] = [
  { id: 'u1', nome: 'Maria Silva', email: 'maria@acme.com', role: 'admin', avatarColor: Colors.raspberryPlum },
  { id: 'u2', nome: 'João Pedro', email: 'joao@acme.com', role: 'colaborador', avatarColor: Colors.midnightViolet },
  { id: 'u3', nome: 'Ana Costa', email: 'ana@acme.com', role: 'colaborador', avatarColor: Colors.racingRed },
  { id: 'u4', nome: 'Rafael Dias', email: 'rafael@acme.com', role: 'colaborador', avatarColor: '#2D3A50' },
];

type UsersState = {
  users: User[];
  currentUserId: string;
  createUser: (input: { nome: string; email: string; role?: UserRole }) => User;
  setRole: (id: string, role: UserRole) => void;
  removeUser: (id: string) => void;
  setCurrentUser: (id: string) => void;
  reset: () => void;
};

const PALETTE = [Colors.midnightViolet, Colors.raspberryPlum, Colors.racingRed, '#2D3A50', '#3A2D50', '#502D3A'];

export const useUsersStore = create<UsersState>()(
  persist(
    (set) => ({
      users: seed,
      currentUserId: 'u1',
      createUser: ({ nome, email, role = 'colaborador' }) => {
        const novo: User = {
          id: `u${Date.now()}`,
          nome,
          email,
          role,
          avatarColor: PALETTE[Math.floor(Math.random() * PALETTE.length)]!,
        };
        set((state) => ({ users: [...state.users, novo] }));
        return novo;
      },
      setRole: (id, role) =>
        set((state) => ({ users: state.users.map((u) => (u.id === id ? { ...u, role } : u)) })),
      removeUser: (id) =>
        set((state) => ({ users: state.users.filter((u) => u.id !== id) })),
      setCurrentUser: (id) => set({ currentUserId: id }),
      reset: () => set({ users: [], currentUserId: '' }),
    }),
    {
      name: 'rotina:users',
      storage: persistStorage,
      partialize: (state) => ({ users: state.users }),
    },
  ),
);

const ANONYMOUS_USER: User = {
  id: '',
  nome: '—',
  email: '',
  role: 'colaborador',
  avatarColor: Colors.midnightViolet,
};

export function useCurrentUser(): User {
  const users = useUsersStore((s) => s.users);
  const id = useUsersStore((s) => s.currentUserId);
  return users.find((u) => u.id === id) ?? users[0] ?? ANONYMOUS_USER;
}
