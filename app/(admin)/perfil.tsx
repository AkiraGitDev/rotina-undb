import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { Divider } from '@/components/ui/divider';
import { Label } from '@/components/ui/label';
import { Screen } from '@/components/ui/screen';
import { Title } from '@/components/ui/title';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { signOutCurrent } from '@/lib/auth';
import { resetAllStores } from '@/lib/store/hydration';
import { useCurrentUser } from '@/lib/store/users';

export default function PerfilAdminScreen() {
  const currentUser = useCurrentUser();

  // Faz signOut no Firebase. O onAuthStateChanged dispara, currentUserId vai
  // pra '', e o (auth)/_layout deixa o usuário ver login.
  async function handleLogout() {
    try {
      await signOutCurrent();
    } catch (e) {
      console.warn('[perfil] signOut:', e);
    }
  }

  function handleReset() {
    Alert.alert(
      'Apagar dados locais?',
      'Projetos e tarefas locais serão apagados e você sairá da conta. Os usuários cadastrados no Firebase continuam.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            await resetAllStores();
          },
        },
      ],
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Avatar nome={currentUser.nome} color={currentUser.avatarColor} size={72} />
          <Title style={styles.title}>{currentUser.nome}</Title>
          <Text style={styles.email}>{currentUser.email}</Text>
          <Label>{currentUser.role === 'admin' ? 'Administrador' : 'Colaborador'}</Label>
        </View>

        <Divider />

        <View style={styles.section}>
          <PropertyRow label="Empresa" value="Acme Ltda." />
          <PropertyRow label="Papel" value={currentUser.role === 'admin' ? 'Administrador' : 'Colaborador'} />
          <PropertyRow label="Membro desde" value="março/2026" />
        </View>

        <Divider />

        <Text style={styles.logout} onPress={handleLogout}>
          Sair da conta
        </Text>

        <Text style={styles.reset} onPress={handleReset}>
          Apagar dados locais (demo)
        </Text>
      </ScrollView>
    </Screen>
  );
}

function PropertyRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.propertyRow}>
      <Text style={styles.propertyLabel}>{label}</Text>
      <Text style={styles.propertyValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingVertical: Spacing.xxl, gap: Spacing.lg },
  header: { alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  title: { marginTop: Spacing.sm },
  email: { color: Colors.text.muted, fontSize: FontSize.base },
  section: { paddingVertical: Spacing.sm },
  propertyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border.subtle,
  },
  propertyLabel: { width: 70, color: Colors.text.muted, fontSize: FontSize.base },
  propertyValue: { flex: 1, color: Colors.text.primary, fontSize: FontSize.md },
  logout: {
    color: Colors.racingRed,
    fontSize: FontSize.md,
    textAlign: 'center',
    paddingVertical: Spacing.lg,
  },
  reset: {
    color: Colors.text.muted,
    fontSize: FontSize.base,
    textAlign: 'center',
    paddingVertical: Spacing.sm,
  },
});
