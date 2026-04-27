import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ApproveTaskSheet } from '@/components/approve-task-sheet';
import { Label } from '@/components/ui/label';
import { ListItem } from '@/components/ui/list-item';
import { Screen } from '@/components/ui/screen';
import { Title } from '@/components/ui/title';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useProjectsStore } from '@/lib/store/projects';
import { usePendingTasks } from '@/lib/store/selectors';
import { useUsersStore } from '@/lib/store/users';
import { Task } from '@/types/task';

export default function AprovacoesScreen() {
  const pendentes = usePendingTasks();
  const projects = useProjectsStore((s) => s.projects);
  const users = useUsersStore((s) => s.users);
  const [selected, setSelected] = useState<Task | null>(null);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Label>Fila de aprovação</Label>
          <Title style={styles.title}>{pendentes.length} pendentes</Title>
        </View>

        <View style={styles.section}>
          {pendentes.length === 0 ? (
            <Text style={styles.empty}>Nada a revisar no momento.</Text>
          ) : (
            pendentes.map((t) => {
              const projeto = projects.find((p) => p.id === t.projetoId);
              const autor = users.find((u) => u.id === t.autorId);
              return (
                <ListItem key={t.id} onPress={() => setSelected(t)}>
                  <Text style={styles.titulo}>{t.titulo}</Text>
                  <Text style={styles.meta}>
                    {projeto?.nome}
                    {autor ? ` · criada por ${autor.nome.split(' ')[0]}` : ''}
                  </Text>
                </ListItem>
              );
            })
          )}
        </View>
      </ScrollView>

      <ApproveTaskSheet task={selected} onDismiss={() => setSelected(null)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: Spacing.lg, paddingBottom: Spacing.xxl, gap: Spacing.lg },
  header: { gap: Spacing.xs },
  title: { marginTop: 2 },
  section: { marginTop: Spacing.sm },
  titulo: { color: Colors.text.primary, fontSize: FontSize.md, fontWeight: FontWeight.medium },
  meta: { color: Colors.text.muted, fontSize: FontSize.base, marginTop: 2 },
  empty: {
    color: Colors.text.muted,
    fontSize: FontSize.base,
    paddingVertical: Spacing.lg,
  },
});
