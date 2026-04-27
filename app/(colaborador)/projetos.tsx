import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Label } from '@/components/ui/label';
import { ListItem } from '@/components/ui/list-item';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { Title } from '@/components/ui/title';
import { Colors, FontSize, FontWeight, LetterSpacing, Spacing } from '@/constants/theme';
import { projectProgress, useProjectsOfUser } from '@/lib/store/selectors';
import { useTasksStore } from '@/lib/store/tasks';
import { useCurrentUser } from '@/lib/store/users';

export default function ProjetosColabScreen() {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const projetosRaw = useProjectsOfUser(currentUser.id);
  const tasks = useTasksStore((s) => s.tasks);
  const projetos = projetosRaw.map((p) => ({
    ...p,
    progresso: projectProgress(tasks.filter((t) => t.projetoId === p.id)),
  }));

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Label>Participo de</Label>
          <Title style={styles.title}>Projetos</Title>
        </View>

        <View style={styles.section}>
          {projetos.map((p) => (
            <ListItem
              key={p.id}
              onPress={() => router.push(`/projeto/${p.id}`)}
              leading={<Text style={styles.emoji}>{p.emoji}</Text>}
              trailing={<Text style={styles.progressValue}>{p.progresso}%</Text>}
            >
              <Text style={styles.name}>{p.nome}</Text>
              <Text style={styles.meta}>{p.membroIds.length} membros</Text>
              <View style={styles.progressWrap}>
                <ProgressBar value={p.progresso} color={Colors.racingRed} />
              </View>
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
  emoji: { fontSize: 22 },
  name: { color: Colors.text.primary, fontSize: FontSize.md, fontWeight: FontWeight.medium },
  meta: { color: Colors.text.muted, fontSize: FontSize.base, marginTop: 2, marginBottom: Spacing.sm },
  progressWrap: { marginRight: Spacing.sm },
  progressValue: {
    color: Colors.text.muted,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    letterSpacing: LetterSpacing.wide,
  },
});
