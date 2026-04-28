import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ProjectMembersSheet } from '@/components/project-members-sheet';
import { Avatar } from '@/components/ui/avatar';
import { Divider } from '@/components/ui/divider';
import { Label } from '@/components/ui/label';
import { ListItem } from '@/components/ui/list-item';
import { PriorityDot } from '@/components/ui/priority-dot';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { Title } from '@/components/ui/title';
import { Colors, FontSize, FontWeight, LetterSpacing, Spacing } from '@/constants/theme';
import { useProjectsStore } from '@/lib/store/projects';
import { projectProgress, useProjectById, useTasksOfProject } from '@/lib/store/selectors';
import { useTasksStore } from '@/lib/store/tasks';
import { useCurrentUser, useUsersStore } from '@/lib/store/users';

export default function ProjetoDetalhe() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const projeto = useProjectById(id);
  const tarefas = useTasksOfProject(id ?? '');
  const users = useUsersStore((s) => s.users);
  const currentUser = useCurrentUser();
  const removeProject = useProjectsStore((s) => s.removeProject);
  const removeTask = useTasksStore((s) => s.removeTask);
  const [editingMembers, setEditingMembers] = useState(false);

  if (!projeto) {
    return (
      <Screen>
        <Text style={styles.notFound}>Projeto não encontrado.</Text>
      </Screen>
    );
  }
  const isAdmin = currentUser.role === 'admin';
  const progresso = projectProgress(tarefas);
  const membros = users.filter((u) => projeto.membroIds.includes(u.id));

  function handleDelete() {
    if (!projeto) return;
    Alert.alert(
      'Apagar projeto?',
      `"${projeto.nome}" e todas as suas ${tarefas.length} tarefas serão removidas.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: () => {
            tarefas.forEach((t) => removeTask(t.id));
            removeProject(projeto.id);
            router.back();
          },
        },
      ],
    );
  }

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerShown: true,
          title: '',
          headerStyle: { backgroundColor: Colors.pitchBlack },
          headerTintColor: Colors.white,
        }}
      />
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
          <View style={styles.sectionHeader}>
            <Label>Membros ({membros.length})</Label>
            {isAdmin ? (
              <Pressable onPress={() => setEditingMembers(true)} hitSlop={8}>
                <Text style={styles.link}>Gerenciar</Text>
              </Pressable>
            ) : null}
          </View>
          {membros.length === 0 ? (
            <Text style={styles.empty}>Nenhum membro ainda.</Text>
          ) : (
            <View style={styles.membersRow}>
              {membros.map((u) => (
                <Avatar key={u.id} nome={u.nome} color={u.avatarColor} size={36} />
              ))}
            </View>
          )}
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
          {tarefas.length === 0 ? <Text style={styles.empty}>Nenhuma tarefa ainda.</Text> : null}
        </View>

        {isAdmin ? (
          <Pressable onPress={handleDelete} style={styles.deleteBtn}>
            <Text style={styles.deleteLabel}>Apagar projeto</Text>
          </Pressable>
        ) : null}
      </ScrollView>

      <ProjectMembersSheet
        projectId={editingMembers ? projeto.id : null}
        onDismiss={() => setEditingMembers(false)}
      />
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
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  link: { color: Colors.text.secondary, fontSize: FontSize.base },
  membersRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm, flexWrap: 'wrap' },
  taskTitle: { color: Colors.text.primary, fontSize: FontSize.md, fontWeight: FontWeight.medium },
  taskMeta: { color: Colors.text.muted, fontSize: FontSize.base, marginTop: 2, textTransform: 'capitalize' },
  taskPercent: { color: Colors.text.muted, fontSize: FontSize.sm },
  empty: { color: Colors.text.muted, fontSize: FontSize.base, paddingVertical: Spacing.sm },
  deleteBtn: { paddingVertical: Spacing.lg, alignItems: 'center', marginTop: Spacing.lg },
  deleteLabel: { color: Colors.racingRed, fontSize: FontSize.md, fontWeight: FontWeight.medium },
  notFound: { color: Colors.text.muted, fontSize: FontSize.md, paddingTop: Spacing.xxl },
});
