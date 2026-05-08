import { getApp, getApps, initializeApp } from '@react-native-firebase/app';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import { Colors } from '@/constants/theme';
import { createColaboradorDoc } from '@/lib/users-firestore';

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
  // Custom code lançado pelo signIn quando o usuário existe mas o email
  // ainda não foi verificado. Veja signIn() abaixo.
  'auth/email-not-verified': 'Email ainda não verificado. Acabamos de reenviar o link de verificação.',
};

export function describeAuthError(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: string }).code;
    return AUTH_ERROR_MESSAGES[code] ?? `Erro ao autenticar (${code}).`;
  }
  return 'Erro inesperado ao autenticar.';
}

export async function signIn(email: string, senha: string): Promise<FirebaseAuthTypes.UserCredential> {
  const cred = await auth().signInWithEmailAndPassword(email, senha);
  // Bloqueia entrada se o email ainda não foi verificado.
  // Reenviamos o link automaticamente (dentro do rate-limit do Firebase)
  // pra cobrir o caso comum de "quero entrar mas perdi o email original".
  if (!cred.user.emailVerified) {
    try {
      await cred.user.sendEmailVerification();
    } catch (e) {
      // Pode dar rate-limit (auth/too-many-requests). Ignoramos — o usuário
      // ainda recebe a mensagem dizendo pra checar o inbox.
      console.warn('[auth] sendEmailVerification durante signIn:', e);
    }
    await auth().signOut();
    const err = new Error('Email não verificado.') as Error & { code: string };
    err.code = 'auth/email-not-verified';
    throw err;
  }
  return cred;
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
  // Manda o email de verificação. O usuário só vai conseguir logar depois
  // de clicar no link recebido.
  await cred.user.sendEmailVerification();
  // Desloga imediatamente — assim o cadastro não dá entrada antes da
  // verificação (a UI mostra "verifique seu email" e leva pro login).
  await auth().signOut();
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

// ─── Convite de colaborador (secondary app pattern) ────────────────────
//
// `auth().createUserWithEmailAndPassword(...)` no app default *substitui*
// a sessão atual pela do novo user — daria pra criar o colaborador, mas
// o admin perderia a sessão. Pra evitar isso, criamos um Firebase App
// secundário (com os mesmos `options` do default, lidos do
// google-services.json) e usamos o `auth` dele só pra criar a credencial.
// O auth do default fica intacto.

const SECONDARY_APP_NAME = 'colab-creator';

async function getSecondaryApp() {
  const existing = getApps().find((a) => a.name === SECONDARY_APP_NAME);
  if (existing) return existing;
  return await initializeApp(getApp().options, SECONDARY_APP_NAME);
}

function senhaTemporaria(): string {
  const charset = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let s = '';
  for (let i = 0; i < 16; i++) s += charset[Math.floor(Math.random() * charset.length)];
  return s;
}

/**
 * Cria conta de colaborador sem mexer na sessão do admin.
 *
 * Fluxo:
 * 1. Cria a credencial via secondary app auth (admin permanece logado)
 * 2. Escreve o doc do perfil em users/{uid} (Firestore default app — admin é
 *    o request.auth.uid, então a regra precisa ter `|| isAdmin()` no create)
 * 3. Manda email de redefinição de senha pro colaborador (qualquer auth
 *    serve; usamos default por simplicidade)
 * 4. Limpa a sessão do secondary
 *
 * Retorna o uid do novo colaborador.
 */
export async function inviteColaborador(
  nome: string,
  email: string,
  avatarColor: string,
): Promise<string> {
  const secondary = await getSecondaryApp();
  const secondaryAuth = auth(secondary);

  let uid: string | null = null;
  try {
    const cred = await secondaryAuth.createUserWithEmailAndPassword(email, senhaTemporaria());
    uid = cred.user.uid;

    await createColaboradorDoc(uid, nome, email, avatarColor);

    // Stateless — usa o auth do default app (admin)
    await auth().sendPasswordResetEmail(email);

    return uid;
  } finally {
    // Garante que a sessão da secondary não fique pendurada nem em sucesso
    // nem em erro (assim o secondary não tenta restaurar sessão errada
    // depois). Se a secondary não tem currentUser, signOut é no-op.
    try {
      if (secondaryAuth.currentUser) {
        await secondaryAuth.signOut();
      }
    } catch (e) {
      console.warn('[auth] secondary signOut falhou:', e);
    }
  }
}
