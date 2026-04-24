import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { GradientButton } from '@/components/ui/gradient-button';
import { Label } from '@/components/ui/label';
import { ListItem } from '@/components/ui/list-item';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { Title } from '@/components/ui/title';
import { Colors, FontSize, FontWeight, LetterSpacing, Spacing } from '@/constants/theme';
import { mockProjects, tasksOfProject } from '@/lib/mock';
import { projectProgress } from '@/lib/progress';

export default function ProjetosAdminScreen() {
  const router = useRouter();
  const projetos = mockProjects.map((p) => ({ ...p, progresso: projectProgress(tasksOfProject(p.id)) }));

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Label>Gerenciar</Label>
          <Title style={styles.title}>Projetos</Title>
        </View>

        <GradientButton label="Novo projeto" onPress={() => {}} />

        <View style={styles.section}>
          {projetos.map((p) => (
            <ListItem
              key={p.id}
              onPress={() => router.push(`/projeto/${p.id}`)}
              leading={<Text style={styles.emoji}>{p.emoji}</Text>}
              trailing={<Text style={styles.progressValue}>{p.progresso}%</Text>}
            >
              <Text style={styles.name}>{p.nome}</Text>
              <Text style={styles.meta}>{p.membroIds.length} membros · {tasksOfProject(p.id).length} tarefas</Text>
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
