import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { GradientButton } from '@/components/ui/gradient-button';
import { Label } from '@/components/ui/label';
import { ListItem } from '@/components/ui/list-item';
import { Screen } from '@/components/ui/screen';
import { Title } from '@/components/ui/title';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { mockUsers } from '@/lib/mock';

export default function UsuariosScreen() {
  const router = useRouter();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Label>Gerenciar</Label>
          <Title style={styles.title}>Usuários</Title>
        </View>

        <GradientButton label="Criar colaborador" onPress={() => router.push('/(admin)/criar-usuario')} />

        <View style={styles.section}>
          {mockUsers.map((u) => (
            <ListItem
              key={u.id}
              leading={<Avatar nome={u.nome} color={u.avatarColor} size={36} />}
              trailing={<Text style={styles.role}>{u.role === 'admin' ? 'Admin' : 'Colab'}</Text>}
            >
              <Text style={styles.nome}>{u.nome}</Text>
              <Text style={styles.meta}>{u.email}</Text>
            </ListItem>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: Spacing.lg, paddingBottom: Spacing.xxl, gap: Spacing.lg },
  header: { gap: Spacing.xs },
  title: { marginTop: 2 },
  section: { marginTop: Spacing.sm },
  nome: { color: Colors.text.primary, fontSize: FontSize.md, fontWeight: FontWeight.medium },
  meta: { color: Colors.text.muted, fontSize: FontSize.base, marginTop: 2 },
  role: { color: Colors.text.muted, fontSize: FontSize.sm },
});
