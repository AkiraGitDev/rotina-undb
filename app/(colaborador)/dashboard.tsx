import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { ListItem } from '@/components/ui/list-item';
import { PriorityDot } from '@/components/ui/priority-dot';
import { ProgressHero } from '@/components/ui/progress-hero';
import { Screen } from '@/components/ui/screen';
import { Title } from '@/components/ui/title';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { currentUser, mockProjects, projectsOfUser, tasksOfUser } from '@/lib/mock';
import { projectProgress } from '@/lib/progress';
import { PRIORITY_WEIGHT } from '@/types/task';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default function ColaboradorDashboard() {
  const router = useRouter();

  const minhasTarefas = tasksOfUser(currentUser.id);
  const ativas = minhasTarefas.filter((t) => t.status === 'aprovada' || t.status === 'em_andamento');
  const pendentes = minhasTarefas.filter((t) => t.status === 'pendente');

  let somaPonderada = 0;
  let somaPesos = 0;
  for (const t of ativas) {
    const peso = t.prioridade ? PRIORITY_WEIGHT[t.prioridade] : 1;
    somaPonderada += peso * t.cumprimento;
    somaPesos += peso;
  }
  const meuProgresso = somaPesos === 0 ? 0 : Math.round(somaPonderada / somaPesos);

  const projetos = projectsOfUser(currentUser.id);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Label>{greeting()}</Label>
            <Title style={styles.title}>{currentUser.nome.split(' ')[0]}</Title>
          </View>
          <Pressable onPress={() => router.push('/(colaborador)/perfil')} hitSlop={8}>
            <Avatar nome={currentUser.nome} color={currentUser.avatarColor} size={40} />
          </Pressable>
        </View>

        <ProgressHero
          label="Meu progresso"
          value={meuProgresso}
          caption={`${ativas.length} tarefas ativas · ${pendentes.length} aguardando aprovação`}
        />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Label>Minhas tarefas</Label>
            <Pressable onPress={() => router.push('/(colaborador)/minhas-tarefas')} hitSlop={8}>
              <Text style={styles.link}>Ver todas</Text>
            </Pressable>
          </View>
          {ativas.length === 0 ? (
            <Text style={styles.empty}>Nenhuma tarefa ativa.</Text>
          ) : (
            ativas.slice(0, 4).map((t) => (
              <ListItem
                key={t.id}
                onPress={() => router.push(`/tarefa/${t.id}`)}
                leading={
                  <View style={styles.checkbox}>
                    {t.cumprimento === 100 ? <View style={styles.checkboxFill} /> : null}
                  </View>
                }
                trailing={
                  <View style={styles.trailingRow}>
                    <Text style={styles.percent}>{t.cumprimento}%</Text>
                    <PriorityDot priority={t.prioridade} />
                  </View>
                }
              >
                <Text style={styles.taskTitle}>{t.titulo}</Text>
                <Text style={styles.taskMeta}>
                  {mockProjects.find((p) => p.id === t.projetoId)?.nome}
                </Text>
              </ListItem>
            ))
          )}
        </View>

        {pendentes.length > 0 ? (
          <View style={styles.section}>
            <Label>Aguardando aprovação</Label>
            {pendentes.slice(0, 3).map((t) => (
              <ListItem key={t.id} leading={<View style={styles.pendingDot} />}>
                <Text style={styles.taskTitle}>{t.titulo}</Text>
                <Text style={styles.taskMeta}>
                  {mockProjects.find((p) => p.id === t.projetoId)?.nome}
                </Text>
              </ListItem>
            ))}
          </View>
        ) : null}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Label>Projetos que participo</Label>
            <Pressable onPress={() => router.push('/(colaborador)/projetos')} hitSlop={8}>
              <Text style={styles.link}>Ver todos</Text>
            </Pressable>
          </View>
          {projetos.map((p) => (
            <ListItem
              key={p.id}
              onPress={() => router.push(`/projeto/${p.id}`)}
              leading={<Text style={styles.emoji}>{p.emoji}</Text>}
            >
              <Text style={styles.projectName}>{p.nome}</Text>
              <Text style={styles.taskMeta}>{p.membroIds.length} membros</Text>
            </ListItem>
          ))}
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
  title: { marginTop: 2 },
  section: { gap: Spacing.xs },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  emoji: { fontSize: 22 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.border.strong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxFill: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: Colors.racingRed,
  },
  trailingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  percent: {
    color: Colors.text.muted,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
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
  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  projectName: {
    color: Colors.text.primary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
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
});
