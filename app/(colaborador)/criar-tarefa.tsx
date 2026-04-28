import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GradientButton } from '@/components/ui/gradient-button';
import { KeyboardSafeScroll } from '@/components/ui/keyboard-safe-scroll';
import { Label } from '@/components/ui/label';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { Title } from '@/components/ui/title';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { useProjectsOfUser } from '@/lib/store/selectors';
import { useTasksStore } from '@/lib/store/tasks';
import { useCurrentUser } from '@/lib/store/users';

export default function CriarTarefaScreen() {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const projetos = useProjectsOfUser(currentUser.id);
  const createTask = useTasksStore((s) => s.createTask);

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [projetoId, setProjetoId] = useState<string | null>(projetos[0]?.id ?? null);
  const [erro, setErro] = useState<string | null>(null);

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
      responsavelId: currentUser.id,
      status: 'pendente',
    });
    router.back();
  }

  return (
    <Screen>
      <KeyboardSafeScroll contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <Label>Nova</Label>
            <Title style={styles.title}>Criar tarefa</Title>
            <Text style={styles.subtitle}>
              Sua tarefa ficará pendente até um admin aprovar e definir o peso.
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

            <View style={styles.projectPicker}>
              <Label>Projeto</Label>
              <View style={styles.chipsRow}>
                {projetos.map((p) => {
                  const selected = projetoId === p.id;
                  return (
                    <Pressable
                      key={p.id}
                      onPress={() => setProjetoId(p.id)}
                      style={[styles.chip, selected && styles.chipSelected]}
                    >
                      <Text style={styles.chipEmoji}>{p.emoji}</Text>
                      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{p.nome}</Text>
                    </Pressable>
                  );
                })}
              </View>
              {erro ? <Text style={styles.error}>{erro}</Text> : null}
            </View>

            <GradientButton label="Enviar para aprovação" onPress={handleCriar} style={styles.cta} />
          </View>
      </KeyboardSafeScroll>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingVertical: Spacing.xxl, gap: Spacing.xl },
  header: { gap: Spacing.sm },
  title: { marginTop: Spacing.sm },
  subtitle: { color: Colors.text.muted, fontSize: FontSize.md, lineHeight: 20 },
  form: { gap: Spacing.lg },
  projectPicker: { gap: Spacing.sm },
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
  cta: { marginTop: Spacing.md },
  error: { color: Colors.racingRed, fontSize: FontSize.sm },
});
