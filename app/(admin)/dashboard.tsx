import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { ListItem } from '@/components/ui/list-item';
import { PriorityDot } from '@/components/ui/priority-dot';
import { ProgressBar } from '@/components/ui/progress-bar';
import { ProgressHero } from '@/components/ui/progress-hero';
import { Screen } from '@/components/ui/screen';
import { Title } from '@/components/ui/title';
import { Colors, FontSize, FontWeight, LetterSpacing, Spacing } from '@/constants/theme';
import { currentUser, mockProjects, mockUsers, pendingTasks, tasksOfProject } from '@/lib/mock';
import { projectProgress } from '@/lib/progress';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default function AdminDashboard() {
  const router = useRouter();

  const projetos = mockProjects.map((p) => ({ ...p, progresso: projectProgress(tasksOfProject(p.id)) }));
  const progressoGeral = Math.round(
    projetos.reduce((acc, p) => acc + p.progresso, 0) / (projetos.length || 1),
  );
  const pendentes = pendingTasks();
  const colaboradores = mockUsers.filter((u) => u.id !== currentUser.id);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Label>{greeting()}</Label>
            <Title style={styles.title}>{currentUser.nome.split(' ')[0]}</Title>
          </View>
          <Pressable onPress={() => router.push('/(admin)/perfil')} hitSlop={8}>
            <Avatar nome={currentUser.nome} color={currentUser.avatarColor} size={40} />
          </Pressable>
        </View>

        <ProgressHero
          label="Progresso geral"
          value={progressoGeral}
          caption={`${projetos.length} projetos ativos · ${pendentes.length} tarefas pendentes`}
        />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Label>Projetos ativos</Label>
            <Pressable onPress={() => router.push('/(admin)/projetos')} hitSlop={8}>
              <Text style={styles.link}>Ver todos</Text>
            </Pressable>
          </View>
          {projetos.map((p) => (
            <ListItem
              key={p.id}
              onPress={() => router.push(`/projeto/${p.id}`)}
              leading={<Text style={styles.emoji}>{p.emoji}</Text>}
              trailing={<Text style={styles.progressValue}>{p.progresso}%</Text>}
            >
              <Text style={styles.projectName}>{p.nome}</Text>
              <View style={styles.progressWrap}>
                <ProgressBar value={p.progresso} color={Colors.racingRed} />
              </View>
            </ListItem>
          ))}
        </View>

        <View style={styles.section}>
          <Label>Aprovações pendentes</Label>
          <View style={styles.spacer} />
          {pendentes.length === 0 ? (
            <Text style={styles.empty}>Nenhuma tarefa aguardando aprovação.</Text>
          ) : (
            pendentes.slice(0, 3).map((t) => (
              <ListItem
                key={t.id}
                onPress={() => router.push('/(admin)/aprovacoes')}
                leading={<PriorityDot priority={t.prioridade} />}
              >
                <Text style={styles.taskTitle}>{t.titulo}</Text>
                <Text style={styles.taskMeta}>
                  {mockProjects.find((p) => p.id === t.projetoId)?.nome}
                </Text>
              </ListItem>
            ))
          )}
          {pendentes.length > 3 ? (
            <Pressable onPress={() => router.push('/(admin)/aprovacoes')} style={styles.moreRow}>
              <Text style={styles.link}>Ver fila completa ({pendentes.length})</Text>
              <Ionicons name="chevron-forward" size={14} color={Colors.text.secondary} />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.section}>
          <Label>Equipe</Label>
          <View style={styles.teamRow}>
            {colaboradores.map((u) => (
              <Avatar key={u.id} nome={u.nome} color={u.avatarColor} size={40} />
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  title: {
    marginTop: 2,
  },
  section: {
    gap: Spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  spacer: { height: Spacing.xs },
  emoji: { fontSize: 22 },
  projectName: {
    color: Colors.text.primary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    marginBottom: Spacing.sm,
  },
  progressWrap: {
    marginRight: Spacing.sm,
  },
  progressValue: {
    color: Colors.text.muted,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    letterSpacing: LetterSpacing.wide,
  },
  taskTitle: {
    color: Colors.text.primary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
  taskMeta: {
    color: Colors.text.muted,
    fontSize: FontSize.base,
    marginTop: 2,
  },
  empty: {
    color: Colors.text.muted,
    fontSize: FontSize.base,
    paddingVertical: Spacing.md,
  },
  link: {
    color: Colors.text.secondary,
    fontSize: FontSize.base,
  },
  moreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: Spacing.sm,
  },
  teamRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
});
