import { Redirect } from 'expo-router';

import { useCurrentUser, useUsersStore } from '@/lib/store/users';

// Quando o app abre, decide pra onde ir baseado no estado do Firebase Auth
// + perfil no Firestore (ambos já alimentados pelo useFirebaseBootstrap em _layout).
export default function Index() {
  const currentUserId = useUsersStore((s) => s.currentUserId);
  const currentUser = useCurrentUser();

  // Não logado → tela de login
  if (!currentUserId) {
    return <Redirect href="/(auth)/login" />;
  }

  // Logado, mas perfil ainda não chegou do Firestore (caso raro: usuário
  // tem auth mas o doc dele foi removido). Manda pra login.
  if (!currentUser.id) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Redirect href={currentUser.role === 'admin' ? '/(admin)/dashboard' : '/(colaborador)/dashboard'} />
  );
}
