import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { GradientButton } from '@/components/ui/gradient-button';
import { Label } from '@/components/ui/label';
import { Title } from '@/components/ui/title';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useProjectsStore } from '@/lib/store/projects';
import { useUsersStore } from '@/lib/store/users';

type Props = {
  projectId: string | null;
  onDismiss: () => void;
};

export function ProjectMembersSheet({ projectId, onDismiss }: Props) {
  const project = useProjectsStore((s) => s.projects.find((p) => p.id === projectId) ?? null);
  const users = useUsersStore((s) => s.users);
  const updateProject = useProjectsStore((s) => s.updateProject);

  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (project) setSelected(project.membroIds);
  }, [project?.id]);

  if (!project) return <BottomSheet visible={false} onDismiss={onDismiss} />;

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handleSave() {
    if (!project) return;
    updateProject(project.id, { membroIds: selected });
    onDismiss();
  }

  return (
    <BottomSheet visible={!!projectId} onDismiss={onDismiss}>
      <View style={styles.header}>
        <Label>Gerenciar membros</Label>
        <Title style={styles.title}>{project.nome}</Title>
        <Text style={styles.caption}>{selected.length} de {users.length} usuários selecionados</Text>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {users.length === 0 ? (
          <Text style={styles.empty}>Nenhum usuário cadastrado.</Text>
        ) : (
          users.map((u) => {
            const checked = selected.includes(u.id);
            return (
              <Pressable key={u.id} onPress={() => toggle(u.id)} style={styles.row}>
                <Avatar nome={u.nome} color={u.avatarColor} size={32} />
                <View style={styles.info}>
                  <Text style={styles.nome}>{u.nome}</Text>
                  <Text style={styles.role}>{u.role === 'admin' ? 'Admin' : 'Colaborador'}</Text>
                </View>
                <View style={[styles.checkbox, checked && styles.checkboxOn]}>
                  {checked ? <View style={styles.checkboxFill} /> : null}
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>

      <GradientButton label="Salvar" onPress={handleSave} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: { gap: 2 },
  title: { marginTop: Spacing.xs },
  caption: { color: Colors.text.muted, fontSize: FontSize.base, marginTop: 2 },
  list: { maxHeight: 320 },
  listContent: { paddingBottom: Spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border.subtle,
  },
  info: { flex: 1 },
  nome: { color: Colors.text.primary, fontSize: FontSize.md, fontWeight: FontWeight.medium },
  role: { color: Colors.text.muted, fontSize: FontSize.base, marginTop: 2 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.border.strong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { borderColor: Colors.racingRed, backgroundColor: Colors.racingRed },
  checkboxFill: { width: 10, height: 10, borderRadius: 2, backgroundColor: Colors.white },
  empty: { color: Colors.text.muted, fontSize: FontSize.base, paddingVertical: Spacing.lg, textAlign: 'center' },
});
