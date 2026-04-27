import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { GradientButton } from '@/components/ui/gradient-button';
import { Label } from '@/components/ui/label';
import { PriorityDot } from '@/components/ui/priority-dot';
import { Title } from '@/components/ui/title';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { useTasksStore } from '@/lib/store/tasks';
import { PRIORITY_WEIGHT, Task, TaskPriority } from '@/types/task';

type Props = {
  task: Task | null;
  onDismiss: () => void;
};

const PRIORIDADES: { value: TaskPriority; label: string }[] = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta', label: 'Alta' },
  { value: 'critica', label: 'Crítica' },
];

export function ApproveTaskSheet({ task, onDismiss }: Props) {
  const approveTask = useTasksStore((s) => s.approveTask);
  const rejectTask = useTasksStore((s) => s.rejectTask);
  const [prioridade, setPrioridade] = useState<TaskPriority>('media');

  useEffect(() => {
    if (task) setPrioridade('media');
  }, [task?.id]);

  if (!task) {
    return <BottomSheet visible={false} onDismiss={onDismiss} />;
  }

  function handleApprove() {
    if (!task) return;
    approveTask(task.id, prioridade);
    onDismiss();
  }

  function handleReject() {
    if (!task) return;
    rejectTask(task.id);
    onDismiss();
  }

  return (
    <BottomSheet visible={!!task} onDismiss={onDismiss}>
      <View style={styles.header}>
        <Label>Revisar tarefa</Label>
        <Title style={styles.title}>{task.titulo}</Title>
      </View>

      <View style={styles.field}>
        <Label>Definir peso</Label>
        <View style={styles.chipsRow}>
          {PRIORIDADES.map((p) => {
            const selected = prioridade === p.value;
            return (
              <Pressable
                key={p.value}
                onPress={() => setPrioridade(p.value)}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <PriorityDot priority={p.value} />
                <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
                  {p.label} · {PRIORITY_WEIGHT[p.value]}pt
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.actions}>
        <GradientButton label="Aprovar" onPress={handleApprove} />
        <Pressable onPress={handleReject} style={styles.rejectBtn}>
          <Text style={styles.rejectLabel}>Rejeitar tarefa</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: { gap: Spacing.xs },
  title: { marginTop: Spacing.xs },
  field: { gap: Spacing.sm },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border.strong,
  },
  chipSelected: { borderColor: Colors.racingRed, backgroundColor: 'rgba(255,31,41,0.08)' },
  chipLabel: { color: Colors.text.secondary, fontSize: FontSize.base, fontWeight: FontWeight.medium },
  chipLabelSelected: { color: Colors.white },
  actions: { gap: Spacing.sm },
  rejectBtn: { paddingVertical: Spacing.md, alignItems: 'center' },
  rejectLabel: { color: Colors.racingRed, fontSize: FontSize.md, fontWeight: FontWeight.medium },
});
