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
import { describeAuthError, inviteColaborador } from '@/lib/auth';

const PALETTE = [Colors.midnightViolet, Colors.raspberryPlum, Colors.racingRed, '#2D3A50', '#3A2D50', '#502D3A'];

export default function CriarUsuarioScreen() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCriar() {
    setErro(null);
    if (!nome.trim() || !email.trim()) {
      setErro('Preencha nome e email.');
      return;
    }
    setLoading(true);
    const cor = PALETTE[Math.floor(Math.random() * PALETTE.length)]!;
    try {
      await inviteColaborador(nome.trim(), email.trim().toLowerCase(), cor);
      router.back();
    } catch (e) {
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
            Vamos enviar um email com link para o colaborador definir a própria senha.
            Você não precisa fazer mais nada.
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
