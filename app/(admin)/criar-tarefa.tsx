import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { GradientButton } from '@/components/ui/gradient-button';
import { Label } from '@/components/ui/label';
import { PriorityDot } from '@/components/ui/priority-dot';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { Title } from '@/components/ui/title';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { useProjectsStore } from '@/lib/store/projects';
import { useTasksStore } from '@/lib/store/tasks';
import { useCurrentUser, useUsersStore } from '@/lib/store/users';
import { PRIORITY_WEIGHT, TaskPriority } from '@/types/task';

const PRIORIDADES: { value: TaskPriority; label: string }[] = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta', label: 'Alta' },
  { value: 'critica', label: 'Crítica' },
];

export default function CriarTarefaAdminScreen() {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const projects = useProjectsStore((s) => s.projects);
  const users = useUsersStore((s) => s.users);
  const createTask = useTasksStore((s) => s.createTask);

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [projetoId, setProjetoId] = useState<string | null>(projects[0]?.id ?? null);
  const [responsavelId, setResponsavelId] = useState<string | null>(null);
  const [prioridade, setPrioridade] = useState<TaskPriority>('media');
  const [erro, setErro] = useState<string | null>(null);

  const projeto = projects.find((p) => p.id === projetoId);
  const elegiveis = projeto ? users.filter((u) => projeto.membroIds.includes(u.id)) : users;

  function handleCriar() {
    setErro(null);
    if (!titulo.trim() || !projetoId) {
      setErro('Preencha o título e selecione um projeto.');
      return;
    }
    createTask({
      titulo: titulo.trim(),
      descricao: descricao.trim() || undefined,
      projetoId,
      autorId: currentUser.id,
      responsavelId: responsavelId ?? undefined,
      prioridade,
      status: 'aprovada',
    });
    router.back();
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Label>Nova</Label>
            <Title style={styles.title}>Criar tarefa</Title>
            <Text style={styles.subtitle}>
              Tarefas criadas por admin já saem aprovadas, sem passar pela fila.
            </Text>
          </View>

          <View style={styles.form}>
            <TextField label="Título" placeholder="Ex: Refazer landing page" value={titulo} onChangeText={setTitulo} />
            <TextField
              label="Descrição"
              placeholder="Opcional"
              value={descricao}
              onChangeText={setDescricao}
              multiline
              numberOfLines={3}
            />

            <View style={styles.field}>
              <Label>Projeto</Label>
              <View style={styles.chipsRow}>
                {projects.map((p) => {
                  const selected = projetoId === p.id;
                  return (
                    <Pressable
                      key={p.id}
                      onPress={() => {
                        setProjetoId(p.id);
                        setResponsavelId(null);
                      }}
                      style={[styles.chip, selected && styles.chipSelected]}
                    >
                      <Text style={styles.chipEmoji}>{p.emoji}</Text>
                      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{p.nome}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.field}>
              <Label>Prioridade (peso)</Label>
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

            <View style={styles.field}>
              <Label>Responsável</Label>
              <View style={styles.responsavelList}>
                {elegiveis.map((u) => {
                  const selected = responsavelId === u.id;
                  return (
                    <Pressable
                      key={u.id}
                      onPress={() => setResponsavelId(u.id)}
                      style={styles.memberRow}
                    >
                      <Avatar nome={u.nome} color={u.avatarColor} size={32} />
                      <View style={styles.memberInfo}>
                        <Text style={styles.memberName}>{u.nome}</Text>
                        <Text style={styles.memberRole}>{u.role === 'admin' ? 'Admin' : 'Colaborador'}</Text>
                      </View>
                      <View style={[styles.radio, selected && styles.radioSelected]}>
                        {selected ? <View style={styles.radioFill} /> : null}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {erro ? <Text style={styles.error}>{erro}</Text> : null}

            <GradientButton label="Criar tarefa" onPress={handleCriar} style={styles.cta} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingVertical: Spacing.xxl, gap: Spacing.xl },
  header: { gap: Spacing.sm },
  title: { marginTop: Spacing.sm },
  subtitle: { color: Colors.text.muted, fontSize: FontSize.md, lineHeight: 20 },
  form: { gap: Spacing.lg },
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
  chipEmoji: { fontSize: 14 },
  chipLabel: { color: Colors.text.secondary, fontSize: FontSize.base, fontWeight: FontWeight.medium },
  chipLabelSelected: { color: Colors.white },
  responsavelList: { gap: 0 },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border.subtle,
  },
  memberInfo: { flex: 1 },
  memberName: { color: Colors.text.primary, fontSize: FontSize.md, fontWeight: FontWeight.medium },
  memberRole: { color: Colors.text.muted, fontSize: FontSize.base, marginTop: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.border.strong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: Colors.racingRed },
  radioFill: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.racingRed },
  error: { color: Colors.racingRed, fontSize: FontSize.sm },
  cta: { marginTop: Spacing.md },
});
