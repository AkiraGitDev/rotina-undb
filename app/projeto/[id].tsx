import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { Divider } from '@/components/ui/divider';
import { Label } from '@/components/ui/label';
import { ListItem } from '@/components/ui/list-item';
import { PriorityDot } from '@/components/ui/priority-dot';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { Title } from '@/components/ui/title';
import { Colors, FontSize, FontWeight, LetterSpacing, Spacing } from '@/constants/theme';
import { mockProjects, mockUsers, tasksOfProject } from '@/lib/mock';
import { projectProgress } from '@/lib/progress';

export default function ProjetoDetalhe() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const projeto = mockProjects.find((p) => p.id === id);
  if (!projeto) {
    return (
      <Screen>
        <Text style={styles.notFound}>Projeto não encontrado.</Text>
      </Screen>
    );
  }
  const tarefas = tasksOfProject(projeto.id);
  const progresso = projectProgress(tarefas);
  const membros = mockUsers.filter((u) => projeto.membroIds.includes(u.id));

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: true, title: '', headerStyle: { backgroundColor: Colors.pitchBlack }, headerTintColor: Colors.white }} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.emoji}>{projeto.emoji}</Text>
          <Title style={styles.title}>{projeto.nome}</Title>
          {projeto.descricao ? <Text style={styles.desc}>{projeto.descricao}</Text> : null}
        </View>

        <View style={styles.progressBlock}>
          <View style={styles.progressHeader}>
            <Label>Progresso ponderado</Label>
            <Text style={styles.progressValue}>{progresso}%</Text>
          </View>
          <ProgressBar value={progresso} color={Colors.racingRed} height={4} />
        </View>

        <Divider />

        <View style={styles.section}>
          <Label>Membros</Label>
          <View style={styles.membersRow}>
            {membros.map((u) => (
              <Avatar key={u.id} nome={u.nome} color={u.avatarColor} size={36} />
            ))}
          </View>
        </View>

        <Divider />

        <View style={styles.section}>
          <Label>Tarefas ({tarefas.length})</Label>
          {tarefas.map((t) => (
            <ListItem
              key={t.id}
              onPress={() => router.push(`/tarefa/${t.id}`)}
              leading={<PriorityDot priority={t.prioridade} />}
              trailing={<Text style={styles.taskPercent}>{t.cumprimento}%</Text>}
            >
              <Text style={styles.taskTitle}>{t.titulo}</Text>
              <Text style={styles.taskMeta}>
                {t.status === 'pendente' ? 'Aguardando aprovação' : t.status.replace('_', ' ')}
              </Text>
            </ListItem>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingVertical: Spacing.lg, gap: Spacing.lg },
  header: { gap: Spacing.sm },
  emoji: { fontSize: 40 },
  title: { marginTop: Spacing.sm },
  desc: { color: Colors.text.muted, fontSize: FontSize.md, lineHeight: 20 },
  progressBlock: { gap: Spacing.sm },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressValue: { color: Colors.white, fontSize: FontSize.lg, fontWeight: FontWeight.medium, letterSpacing: LetterSpacing.tight },
  section: { gap: Spacing.sm, paddingVertical: Spacing.sm },
  membersRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  taskTitle: { color: Colors.text.primary, fontSize: FontSize.md, fontWeight: FontWeight.medium },
  taskMeta: { color: Colors.text.muted, fontSize: FontSize.base, marginTop: 2, textTransform: 'capitalize' },
  taskPercent: { color: Colors.text.muted, fontSize: FontSize.sm },
  notFound: { color: Colors.text.muted, fontSize: FontSize.md, paddingTop: Spacing.xxl },
});
