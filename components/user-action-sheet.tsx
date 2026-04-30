import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Label } from '@/components/ui/label';
import { Title } from '@/components/ui/title';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useUsersStore } from '@/lib/store/users';
import { removeUserDoc, setUserRole } from '@/lib/users-firestore';
import { User } from '@/types/user';

type Props = {
  user: User | null;
  onDismiss: () => void;
};

export function UserActionSheet({ user, onDismiss }: Props) {
  const currentUserId = useUsersStore((s) => s.currentUserId);

  if (!user) return <BottomSheet visible={false} onDismiss={onDismiss} />;

  const isSelf = user.id === currentUserId;

  // Mutações vão direto pro Firestore. O onSnapshot do bootstrap
  // reflete a mudança no store e UI atualiza sozinho.
  async function handleElevate() {
    if (!user) return;
    try {
      await setUserRole(user.id, user.role === 'admin' ? 'colaborador' : 'admin');
    } catch (e) {
      console.warn('[user-action-sheet] setUserRole:', e);
    }
    onDismiss();
  }

  async function handleRemove() {
    if (!user) return;
    try {
      await removeUserDoc(user.id);
      // Nota: a credencial dele no Firebase Auth permanece — só dá pra
      // apagar via Admin SDK (Cloud Function). Pra demo, OK.
    } catch (e) {
      console.warn('[user-action-sheet] removeUserDoc:', e);
    }
    onDismiss();
  }

  return (
    <BottomSheet visible={!!user} onDismiss={onDismiss}>
      <View style={styles.header}>
        <Avatar nome={user.nome} color={user.avatarColor} size={48} />
        <View style={styles.headerInfo}>
          <Label>{user.role === 'admin' ? 'Administrador' : 'Colaborador'}</Label>
          <Title style={styles.title}>{user.nome}</Title>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>

      {isSelf ? (
        <Text style={styles.note}>Você não pode editar sua própria conta aqui.</Text>
      ) : (
        <View>
          <Pressable onPress={handleElevate} style={styles.action}>
            <Text style={styles.actionLabel}>
              {user.role === 'admin' ? 'Rebaixar para colaborador' : 'Elevar a administrador'}
            </Text>
          </Pressable>
          <Pressable onPress={handleRemove} style={styles.action}>
            <Text style={[styles.actionLabel, styles.danger]}>Remover usuário</Text>
          </Pressable>
        </View>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  headerInfo: { flex: 1, gap: 2 },
  title: { marginTop: 2 },
  email: { color: Colors.text.muted, fontSize: FontSize.base },
  action: {
    paddingVertical: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border.subtle,
  },
  actionLabel: { color: Colors.white, fontSize: FontSize.md, fontWeight: FontWeight.medium },
  danger: { color: Colors.racingRed },
  note: { color: Colors.text.muted, fontSize: FontSize.base, paddingVertical: Spacing.md },
});
