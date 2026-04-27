import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Divider } from '@/components/ui/divider';
import { Label } from '@/components/ui/label';
import { PriorityDot } from '@/components/ui/priority-dot';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { Title } from '@/components/ui/title';
import { Colors, FontSize, FontWeight, LetterSpacing, Radius, Spacing } from '@/constants/theme';
import { useProjectById, useTaskById, useUserById } from '@/lib/store/selectors';
import { useTasksStore } from '@/lib/store/tasks';
import { useCurrentUser } from '@/lib/store/users';
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

const PROGRESS_STEPS = [0, 25, 50, 75, 100];

export default function TarefaDetalhe() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tarefa = useTaskById(id);
  const projeto = useProjectById(tarefa?.projetoId);
  const responsavel = useUserById(tarefa?.responsavelId);
  const autor = useUserById(tarefa?.autorId);
  const currentUser = useCurrentUser();
  const updateProgress = useTasksStore((s) => s.updateProgress);
  const removeTask = useTasksStore((s) => s.removeTask);

  if (!tarefa) {
    return (
      <Screen>
        <Text style={styles.notFound}>Tarefa não encontrada.</Text>
      </Screen>
    );
  }

  const isResponsavel = tarefa.responsavelId === currentUser.id;
  const isAdmin = currentUser.role === 'admin';
  const podeAtualizarProgresso =
    (isResponsavel || isAdmin) &&
    (tarefa.status === 'aprovada' || tarefa.status === 'em_andamento' || tarefa.status === 'concluida');

  function handleDelete() {
    if (!tarefa) return;
    Alert.alert('Apagar tarefa?', `"${tarefa.titulo}" será removida.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: () => {
          removeTask(tarefa.id);
          router.back();
        },
      },
    ]);
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

          {podeAtualizarProgresso ? (
            <View style={styles.stepsRow}>
              {PROGRESS_STEPS.map((step) => {
                const selected = tarefa.cumprimento === step;
                return (
                  <Pressable
                    key={step}
                    onPress={() => updateProgress(tarefa.id, step)}
                    style={[styles.step, selected && styles.stepSelected]}
                  >
                    <Text style={[styles.stepLabel, selected && styles.stepLabelSelected]}>{step}%</Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
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
          <PropertyRow label="Atualizada" value={tarefa.atualizadaEm} />
        </View>

        {isAdmin ? (
          <Pressable onPress={handleDelete} style={styles.deleteBtn}>
            <Text style={styles.deleteLabel}>Apagar tarefa</Text>
          </Pressable>
        ) : null}
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
  stepsRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  step: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border.strong,
    alignItems: 'center',
  },
  stepSelected: { borderColor: Colors.racingRed, backgroundColor: 'rgba(255,31,41,0.08)' },
  stepLabel: { color: Colors.text.secondary, fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  stepLabelSelected: { color: Colors.white },
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
  deleteBtn: { paddingVertical: Spacing.lg, alignItems: 'center', marginTop: Spacing.lg },
  deleteLabel: { color: Colors.racingRed, fontSize: FontSize.md, fontWeight: FontWeight.medium },
  notFound: { color: Colors.text.muted, fontSize: FontSize.md, paddingTop: Spacing.xxl },
});
