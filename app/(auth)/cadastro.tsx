import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GradientButton } from '@/components/ui/gradient-button';
import { Label } from '@/components/ui/label';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { Title } from '@/components/ui/title';
import { Colors, FontSize, Spacing } from '@/constants/theme';

export default function CadastroScreen() {
  const router = useRouter();
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleCadastrar() {
    setErro(null);
    if (!nomeEmpresa.trim() || !nome.trim() || !email.trim() || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha deve ter ao menos 6 caracteres.');
      return;
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    // TODO: integrar cadastro real. Primeiro usuário da empresa vira admin.
    setTimeout(() => {
      setLoading(false);
      router.replace('/(admin)/dashboard');
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
            <Label>Criar conta</Label>
            <Title style={styles.title}>Cadastrar empresa</Title>
            <Text style={styles.subtitle}>
              Você será o primeiro administrador e poderá convidar colaboradores depois.
            </Text>
          </View>

          <View style={styles.form}>
            <TextField
              label="Nome da empresa"
              placeholder="Acme Ltda."
              autoCapitalize="words"
              value={nomeEmpresa}
              onChangeText={setNomeEmpresa}
            />
            <TextField
              label="Seu nome"
              placeholder="Maria Silva"
              autoCapitalize="words"
              value={nome}
              onChangeText={setNome}
            />
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
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />
            <TextField
              label="Confirmar senha"
              placeholder="••••••••"
              secureTextEntry
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              error={erro ?? undefined}
            />

            <GradientButton
              label="Criar conta"
              onPress={handleCadastrar}
              loading={loading}
              style={styles.cta}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem conta? </Text>
            <Link href="/(auth)/login">
              <Text style={styles.footerLink}>Entrar</Text>
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
    paddingVertical: Spacing.xxl,
  },
  header: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
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
