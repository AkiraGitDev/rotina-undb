import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Divider } from '@/components/ui/divider';
import { Label } from '@/components/ui/label';
import { PriorityDot } from '@/components/ui/priority-dot';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { Title } from '@/components/ui/title';
import { Colors, FontSize, FontWeight, LetterSpacing, Spacing } from '@/constants/theme';
import { mockProjects, mockTasks, mockUsers } from '@/lib/mock';
import { PRIORITY_WEIGHT, TaskPriority, TaskStatus } from '@/types/task';

const STATUS_LABEL: Record<TaskStatus, string> = {
  rascunho: 'Rascunho',
  pendente: 'Pendente de aprovação',
  aprovada: 'Aprovada',
  rejeitada: 'Rejeitada',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
};

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  critica: 'Crítica',
};

export default function TarefaDetalhe() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tarefa = mockTasks.find((t) => t.id === id);
  if (!tarefa) {
    return (
      <Screen>
        <Text style={styles.notFound}>Tarefa não encontrada.</Text>
      </Screen>
    );
  }
  const projeto = mockProjects.find((p) => p.id === tarefa.projetoId);
  const responsavel = mockUsers.find((u) => u.id === tarefa.responsavelId);
  const autor = mockUsers.find((u) => u.id === tarefa.autorId);

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: true, title: '', headerStyle: { backgroundColor: Colors.pitchBlack }, headerTintColor: Colors.white }} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Label>{STATUS_LABEL[tarefa.status]}</Label>
          <Title style={styles.title}>{tarefa.titulo}</Title>
          {tarefa.descricao ? <Text style={styles.desc}>{tarefa.descricao}</Text> : null}
        </View>

        <View style={styles.progressBlock}>
          <View style={styles.progressHeader}>
            <Label>Cumprimento</Label>
            <Text style={styles.progressValue}>{tarefa.cumprimento}%</Text>
          </View>
          <ProgressBar value={tarefa.cumprimento} color={Colors.racingRed} height={4} />
        </View>

        <Divider />

        <View style={styles.section}>
          <PropertyRow label="Projeto" value={projeto?.nome ?? '—'} />
          <PropertyRow
            label="Peso"
            value={
              tarefa.prioridade
                ? `${PRIORITY_LABEL[tarefa.prioridade]} · ${PRIORITY_WEIGHT[tarefa.prioridade]} pt`
                : 'Não definido'
            }
            leading={<PriorityDot priority={tarefa.prioridade} />}
          />
          <PropertyRow label="Responsável" value={responsavel?.nome ?? '—'} />
          <PropertyRow label="Criada por" value={autor?.nome ?? '—'} />
          <PropertyRow label="Criada em" value={tarefa.criadaEm} />
        </View>
      </ScrollView>
    </Screen>
  );
}

function PropertyRow({ label, value, leading }: { label: string; value: string; leading?: React.ReactNode }) {
  return (
    <View style={styles.propertyRow}>
      <Text style={styles.propertyLabel}>{label}</Text>
      <View style={styles.propertyValueWrap}>
        {leading ? <View style={{ marginRight: 8 }}>{leading}</View> : null}
        <Text style={styles.propertyValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingVertical: Spacing.lg, gap: Spacing.lg },
  header: { gap: Spacing.sm },
  title: { marginTop: Spacing.sm },
  desc: { color: Colors.text.muted, fontSize: FontSize.md, lineHeight: 20 },
  progressBlock: { gap: Spacing.sm },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressValue: { color: Colors.white, fontSize: FontSize.lg, fontWeight: FontWeight.medium, letterSpacing: LetterSpacing.tight },
  section: { paddingVertical: Spacing.sm },
  propertyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border.subtle,
  },
  propertyLabel: { width: 90, color: Colors.text.muted, fontSize: FontSize.base },
  propertyValueWrap: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  propertyValue: { color: Colors.text.primary, fontSize: FontSize.md, flex: 1 },
  notFound: { color: Colors.text.muted, fontSize: FontSize.md, paddingTop: Spacing.xxl },
});
