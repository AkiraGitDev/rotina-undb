import { useEffect, useState } from 'react';

import { useUsersStore } from './users';

import { subscribeAuth } from '@/lib/auth';
import { subscribeUsers } from '@/lib/users-firestore';

type BootstrapState = {
  initializing: boolean;
};

// Hook que conecta Firebase ao app:
// - subscribeAuth: ouve mudanças de login/logout e atualiza currentUserId no store
// - subscribeUsers: ouve a coleção 'users' do Firestore e atualiza o array no store
//
// Roda uma vez no root layout. Enquanto a primeira leitura não terminou,
// retorna initializing=true pra mostrar splash.
export function useFirebaseBootstrap(): BootstrapState {
  const setUsers = useUsersStore((s) => s.setUsers);
  const setCurrentUser = useUsersStore((s) => s.setCurrentUser);
  const [authReady, setAuthReady] = useState(false);
  const [usersReady, setUsersReady] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = subscribeAuth((user) => {
      setCurrentUser(user?.uid ?? '');
      setAuthReady(true);
    });

    const unsubscribeUsers = subscribeUsers((users) => {
      setUsers(users);
      setUsersReady(true);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeUsers();
    };
  }, [setCurrentUser, setUsers]);

  return { initializing: !authReady || !usersReady };
}
