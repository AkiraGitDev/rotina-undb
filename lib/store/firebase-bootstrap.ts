import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { useUsersStore } from './users';

import { subscribeAuth } from '@/lib/auth';
import { subscribeUsers } from '@/lib/users-firestore';

type BootstrapState = {
  initializing: boolean;
};

// Hook que conecta Firebase ao app. RNFirebase é nativo-only — na web,
// não tenta inicializar (a UI continua acessível mas login/firestore não
// funcionam ali). Pra rodar a demo de verdade é no Dev Client Android.
//
// Try/catch em volta das subscribes pra que falhas de init do Firebase
// (típicas em web ou em casos raros no Android) não congelem o app —
// caem direto pra "initializing=false" e o app mostra a tela de login.
export function useFirebaseBootstrap(): BootstrapState {
  const setUsers = useUsersStore((s) => s.setUsers);
  const setCurrentUser = useUsersStore((s) => s.setCurrentUser);

  const isWeb = Platform.OS === 'web';
  const [authReady, setAuthReady] = useState(isWeb);
  const [usersReady, setUsersReady] = useState(isWeb);

  useEffect(() => {
    if (isWeb) return;

    let unsubscribeAuth: (() => void) | undefined;
    let unsubscribeUsers: (() => void) | undefined;

    try {
      unsubscribeAuth = subscribeAuth((user) => {
        setCurrentUser(user?.uid ?? '');
        setAuthReady(true);
      });
    } catch (e) {
      console.warn('[firebase-bootstrap] subscribeAuth falhou:', e);
      setAuthReady(true);
    }

    try {
      unsubscribeUsers = subscribeUsers((users) => {
        setUsers(users);
        setUsersReady(true);
      });
    } catch (e) {
      console.warn('[firebase-bootstrap] subscribeUsers falhou:', e);
      setUsersReady(true);
    }

    return () => {
      unsubscribeAuth?.();
      unsubscribeUsers?.();
    };
  }, [isWeb, setCurrentUser, setUsers]);

  return { initializing: !authReady || !usersReady };
}
