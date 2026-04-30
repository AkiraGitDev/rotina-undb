import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import { Colors } from '@/constants/theme';

// Códigos de erro do Firebase Auth → mensagens em português pra UI.
// Lista completa: https://firebase.google.com/docs/reference/js/auth#autherrorcodes
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'Email inválido.',
  'auth/user-disabled': 'Esta conta foi desativada.',
  'auth/user-not-found': 'Usuário não encontrado.',
  'auth/wrong-password': 'Senha incorreta.',
  'auth/invalid-credential': 'Email ou senha incorretos.',
  'auth/email-already-in-use': 'Já existe uma conta com esse email.',
  'auth/weak-password': 'A senha é muito fraca (mínimo 6 caracteres).',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
  'auth/network-request-failed': 'Falha de rede. Verifique sua conexão.',
};

export function describeAuthError(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: string }).code;
    return AUTH_ERROR_MESSAGES[code] ?? `Erro ao autenticar (${code}).`;
  }
  return 'Erro inesperado ao autenticar.';
}

export async function signIn(email: string, senha: string): Promise<FirebaseAuthTypes.UserCredential> {
  return auth().signInWithEmailAndPassword(email, senha);
}

export async function signUpAdmin(nome: string, email: string, senha: string): Promise<string> {
  const cred = await auth().createUserWithEmailAndPassword(email, senha);
  await firestore()
    .collection('users')
    .doc(cred.user.uid)
    .set({
      nome,
      email,
      role: 'admin',
      avatarColor: Colors.raspberryPlum,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  return cred.user.uid;
}

export async function signOutCurrent(): Promise<void> {
  return auth().signOut();
}

export async function sendReset(email: string): Promise<void> {
  return auth().sendPasswordResetEmail(email);
}

export function subscribeAuth(
  cb: (user: FirebaseAuthTypes.User | null) => void,
): () => void {
  return auth().onAuthStateChanged(cb);
}

// Checa se já existe pelo menos um usuário cadastrado — usado pra
// bloquear a tela de cadastro depois do primeiro admin ser criado.
export async function hasAnyUser(): Promise<boolean> {
  const snap = await firestore().collection('users').limit(1).get();
  return !snap.empty;
}

export type FirestoreUserDoc = {
  nome: string;
  email: string;
  role: 'admin' | 'colaborador';
  avatarColor: string;
  createdAt?: FirebaseFirestoreTypes.Timestamp;
};
