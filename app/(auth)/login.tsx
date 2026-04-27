import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GradientButton } from '@/components/ui/gradient-button';
import { Label } from '@/components/ui/label';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { Title } from '@/components/ui/title';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useUsersStore } from '@/lib/store/users';

export default function LoginScreen() {
  const router = useRouter();
  const users = useUsersStore((s) => s.users);
  const setCurrentUser = useUsersStore((s) => s.setCurrentUser);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleEntrar() {
    setErro(null);
    if (!email.trim() || !senha) {
      setErro('Preencha email e senha.');
      return;
    }
    setLoading(true);
    // TODO: integrar autenticação real. Por ora, casa pelo email do mock; senão, decide por heurística.
    setTimeout(() => {
      setLoading(false);
      const match = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (match) {
        setCurrentUser(match.id);
        router.replace(match.role === 'admin' ? '/(admin)/dashboard' : '/(colaborador)/dashboard');
        return;
      }
      const fallbackAdmin = email.toLowerCase().includes('admin');
      const fallback = users.find((u) => u.role === (fallbackAdmin ? 'admin' : 'colaborador'));
      if (fallback) setCurrentUser(fallback.id);
      router.replace(fallbackAdmin ? '/(admin)/dashboard' : '/(colaborador)/dashboard');
    }, 500);
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Label>Rotina</Label>
            <Title style={styles.title}>Entrar na sua conta</Title>
            <Text style={styles.subtitle}>
              Organize tarefas e projetos da sua equipe em um só lugar.
            </Text>
          </View>

          <View style={styles.form}>
            <TextField
              label="Email"
              placeholder="voce@empresa.com"
              keyboardType="email-address"
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
            />
            <TextField
              label="Senha"
              placeholder="••••••••"
              secureTextEntry
              autoComplete="password"
              value={senha}
              onChangeText={setSenha}
              error={erro ?? undefined}
            />

            <Link href="/(auth)/esqueci-senha" style={styles.linkRight}>
              <Text style={styles.linkText}>Esqueci minha senha</Text>
            </Link>

            <GradientButton label="Entrar" onPress={handleEntrar} loading={loading} style={styles.cta} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Primeira vez aqui? </Text>
            <Link href="/(auth)/cadastro">
              <Text style={styles.footerLink}>Cadastrar empresa</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
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
  linkRight: {
    alignSelf: 'flex-end',
  },
  linkText: {
    color: Colors.text.secondary,
    fontSize: FontSize.base,
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
