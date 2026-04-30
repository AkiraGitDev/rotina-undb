import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { GradientButton } from '@/components/ui/gradient-button';
import { KeyboardSafeScroll } from '@/components/ui/keyboard-safe-scroll';
import { Label } from '@/components/ui/label';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { Title } from '@/components/ui/title';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { sendReset } from '@/lib/auth';

export default function EsqueciSenhaScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  async function handleEnviar() {
    setErro(null);
    if (!email.trim()) {
      setErro('Informe seu email.');
      return;
    }
    setLoading(true);
    try {
      await sendReset(email.trim().toLowerCase());
    } catch (e) {
      // Boa prática: não revelar se o email existe ou não (anti-enumeration).
      // Erros genuínos de rede a gente também trata como sucesso visual —
      // se o link não chegar, o usuário tenta de novo.
      console.warn('[esqueci-senha] sendReset:', e);
    } finally {
      setLoading(false);
      setEnviado(true);
    }
  }

  return (
    <Screen>
      <KeyboardSafeScroll contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <Label>Recuperar acesso</Label>
            <Title style={styles.title}>Esqueci minha senha</Title>
            <Text style={styles.subtitle}>
              {enviado
                ? 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha em instantes.'
                : 'Informe o email da sua conta e enviaremos um link para redefinir a senha.'}
            </Text>
          </View>

          {!enviado ? (
            <View style={styles.form}>
              <TextField
                label="Email"
                placeholder="voce@empresa.com"
                keyboardType="email-address"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
                error={erro ?? undefined}
              />

              <GradientButton
                label="Enviar link"
                onPress={handleEnviar}
                loading={loading}
                style={styles.cta}
              />
            </View>
          ) : (
            <GradientButton
              label="Voltar ao login"
              onPress={() => router.replace('/(auth)/login')}
              style={styles.cta}
            />
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Lembrou a senha? </Text>
            <Link href="/(auth)/login">
              <Text style={styles.footerLink}>Entrar</Text>
            </Link>
          </View>
      </KeyboardSafeScroll>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingVertical: Spacing.xxl,
  },
  header: {
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  title: {
    marginTop: Spacing.md,
  },
  subtitle: {
    color: Colors.text.muted,
    fontSize: FontSize.md,
    lineHeight: 20,
  },
  form: {
    gap: Spacing.lg,
  },
  cta: {
    marginTop: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  footerText: {
    color: Colors.text.muted,
    fontSize: FontSize.base,
  },
  footerLink: {
    color: Colors.white,
    fontSize: FontSize.base,
  },
});
