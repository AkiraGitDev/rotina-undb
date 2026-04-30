import { Redirect, Stack } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useCurrentUser, useUsersStore } from '@/lib/store/users';

export default function AuthLayout() {
  // Se o usuário já está logado (tem uid no Firebase + doc no Firestore),
  // não faz sentido ele ver tela de login/cadastro. Manda direto pro dashboard.
  const currentUserId = useUsersStore((s) => s.currentUserId);
  const currentUser = useCurrentUser();

  if (currentUserId && currentUser.id) {
    return (
      <Redirect href={currentUser.role === 'admin' ? '/(admin)/dashboard' : '/(colaborador)/dashboard'} />
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.pitchBlack },
        animation: 'slide_from_right',
      }}
    />
  );
}
