import auth from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { GradientButton } from '@/components/ui/gradient-button';
import { KeyboardSafeScroll } from '@/components/ui/keyboard-safe-scroll';
import { Label } from '@/components/ui/label';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { Title } from '@/components/ui/title';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { describeAuthError, sendReset, signIn } from '@/lib/auth';
import { useCurrentUser } from '@/lib/store/users';
import { createColaboradorDoc } from '@/lib/users-firestore';

const PALETTE = [Colors.midnightViolet, Colors.raspberryPlum, Colors.racingRed, '#2D3A50', '#3A2D50', '#502D3A'];

// Gera senha temporária de 16 caracteres só pra criar a conta.
// O colaborador recebe email de reset e define a senha de verdade.
function senhaTemporaria(): string {
  const charset = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let s = '';
  for (let i = 0; i < 16; i++) s += charset[Math.floor(Math.random() * charset.length)];
  return s;
}

export default function CriarUsuarioScreen() {
  const router = useRouter();
  const currentUser = useCurrentUser();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senhaAdmin, setSenhaAdmin] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCriar() {
    setErro(null);
    if (!nome.trim() || !email.trim() || !senhaAdmin) {
      setErro('Preencha todos os campos.');
      return;
    }
    setLoading(true);
    const adminEmail = currentUser.email;
    const colabEmail = email.trim().toLowerCase();
    const colabNome = nome.trim();
    const cor = PALETTE[Math.floor(Math.random() * PALETTE.length)]!;

    try {
      // 1) Cria a conta do colaborador. ATENÇÃO: isso troca a sessão atual
      //    pra ele automaticamente — admin é deslogado por baixo dos panos.
      const cred = await auth().createUserWithEmailAndPassword(colabEmail, senhaTemporaria());
      const uid = cred.user.uid;

      // 2) Grava o perfil dele na collection users do Firestore.
      await createColaboradorDoc(uid, colabNome, colabEmail, cor);

      // 3) Manda email de reset pro colaborador definir a própria senha.
      await sendReset(colabEmail);

      // 4) Faz signOut da sessão do colaborador e re-loga como admin.
      //    (pra demo. Em produção, esse fluxo todo viraria uma Cloud Function
      //    com Admin SDK e o admin nunca perderia a sessão.)
      await auth().signOut();
      await signIn(adminEmail, senhaAdmin);

      router.back();
    } catch (e) {
      // Tenta restaurar sessão admin se algo deu errado no meio
      try {
        if (auth().currentUser?.uid !== currentUser.id) {
          await signIn(adminEmail, senhaAdmin);
        }
      } catch {
        /* admin terá que relogar manualmente */
      }
      setErro(describeAuthError(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <KeyboardSafeScroll contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Label>Novo membro</Label>
          <Title style={styles.title}>Criar colaborador</Title>
          <Text style={styles.subtitle}>
            Um email com link para definir a senha será enviado para o colaborador.
            Para criar a conta, confirme sua senha de admin abaixo.
          </Text>
        </View>

        <View style={styles.form}>
          <TextField label="Nome" placeholder="Maria Silva" autoCapitalize="words" value={nome} onChangeText={setNome} />
          <TextField
            label="Email"
            placeholder="maria@empresa.com"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextField
            label="Sua senha (admin)"
            placeholder="••••••••"
            secureTextEntry
            value={senhaAdmin}
            onChangeText={setSenhaAdmin}
            error={erro ?? undefined}
          />
          <GradientButton label="Enviar convite" onPress={handleCriar} loading={loading} style={styles.cta} />
        </View>
      </KeyboardSafeScroll>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingVertical: Spacing.xxl, gap: Spacing.xl },
  header: { gap: Spacing.sm },
  title: { marginTop: Spacing.sm },
  subtitle: { color: Colors.text.muted, fontSize: FontSize.md, lineHeight: 20 },
  form: { gap: Spacing.lg },
  cta: { marginTop: Spacing.md },
});
