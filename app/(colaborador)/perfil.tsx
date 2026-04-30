import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { Divider } from '@/components/ui/divider';
import { Label } from '@/components/ui/label';
import { Screen } from '@/components/ui/screen';
import { Title } from '@/components/ui/title';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { signOutCurrent } from '@/lib/auth';
import { useCurrentUser } from '@/lib/store/users';

export default function PerfilColabScreen() {
  const currentUser = useCurrentUser();

  async function handleLogout() {
    try {
      await signOutCurrent();
    } catch (e) {
      console.warn('[perfil-colab] signOut:', e);
    }
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
});
