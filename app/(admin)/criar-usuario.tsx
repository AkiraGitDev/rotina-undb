import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { GradientButton } from '@/components/ui/gradient-button';
import { Label } from '@/components/ui/label';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { Title } from '@/components/ui/title';
import { Spacing } from '@/constants/theme';
import { useUsersStore } from '@/lib/store/users';

export default function CriarUsuarioScreen() {
  const router = useRouter();
  const createUser = useUsersStore((s) => s.createUser);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  function handleCriar() {
    setErro(null);
    if (!nome.trim() || !email.trim()) {
      setErro('Preencha nome e email.');
      return;
    }
    createUser({ nome: nome.trim(), email: email.trim().toLowerCase(), role: 'colaborador' });
    router.back();
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Label>Novo membro</Label>
            <Title style={styles.title}>Criar colaborador</Title>
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
            <GradientButton label="Enviar convite" onPress={handleCriar} style={styles.cta} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingVertical: Spacing.xxl, gap: Spacing.xl },
  header: { gap: Spacing.sm },
  title: { marginTop: Spacing.sm },
  form: { gap: Spacing.lg },
  cta: { marginTop: Spacing.md },
});
