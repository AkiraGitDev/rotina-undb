import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Label } from '@/components/ui/label';
import { ListItem } from '@/components/ui/list-item';
import { PriorityDot } from '@/components/ui/priority-dot';
import { Screen } from '@/components/ui/screen';
import { Title } from '@/components/ui/title';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useProjectsStore } from '@/lib/store/projects';
import { useTasksOfUser } from '@/lib/store/selectors';
import { useCurrentUser } from '@/lib/store/users';

export default function MinhasTarefasScreen() {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const tarefas = useTasksOfUser(currentUser.id);
  const projects = useProjectsStore((s) => s.projects);

  const ativas = tarefas.filter((t) => t.status === 'aprovada' || t.status === 'em_andamento');
  const pendentes = tarefas.filter((t) => t.status === 'pendente');
  const concluidas = tarefas.filter((t) => t.status === 'concluida');
  const rejeitadas = tarefas.filter((t) => t.status === 'rejeitada');

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Label>Suas</Label>
          <Title style={styles.title}>Tarefas</Title>
        </View>

        {ativas.length > 0 && (
          <View style={styles.section}>
            <Label>Ativas</Label>
            {ativas.map((t) => (
              <ListItem
                key={t.id}
                onPress={() => router.push(`/tarefa/${t.id}`)}
                leading={<View style={styles.checkbox} />}
                trailing={
                  <View style={styles.trailingRow}>
                    <Text style={styles.percent}>{t.cumprimento}%</Text>
                    <PriorityDot priority={t.prioridade} />
                  </View>
                }
              >
                <Text style={styles.titulo}>{t.titulo}</Text>
                <Text style={styles.meta}>{projects.find((p) => p.id === t.projetoId)?.nome}</Text>
              </ListItem>
            ))}
          </View>
        )}

        {pendentes.length > 0 && (
          <View style={styles.section}>
            <Label>Aguardando aprovação</Label>
            {pendentes.map((t) => (
              <ListItem key={t.id} leading={<View style={styles.pendingDot} />}>
                <Text style={styles.titulo}>{t.titulo}</Text>
                <Text style={styles.meta}>{projects.find((p) => p.id === t.projetoId)?.nome}</Text>
              </ListItem>
            ))}
          </View>
        )}

        {concluidas.length > 0 && (
          <View style={styles.section}>
            <Label>Concluídas</Label>
            {concluidas.map((t) => (
              <ListItem
                key={t.id}
                onPress={() => router.push(`/tarefa/${t.id}`)}
                leading={<View style={[styles.checkbox, styles.checkboxDone]} />}
              >
                <Text style={[styles.titulo, styles.tituloDone]}>{t.titulo}</Text>
                <Text style={styles.meta}>{projects.find((p) => p.id === t.projetoId)?.nome}</Text>
              </ListItem>
            ))}
          </View>
        )}

        {rejeitadas.length > 0 && (
          <View style={styles.section}>
            <Label>Rejeitadas</Label>
            {rejeitadas.map((t) => (
              <ListItem key={t.id} leading={<View style={[styles.pendingDot, styles.rejectedDot]} />}>
                <Text style={[styles.titulo, styles.tituloRejected]}>{t.titulo}</Text>
                <Text style={styles.meta}>{projects.find((p) => p.id === t.projetoId)?.nome}</Text>
              </ListItem>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: Spacing.lg, paddingBottom: Spacing.xxl, gap: Spacing.xl },
  header: { gap: Spacing.xs },
  title: { marginTop: 2 },
  section: { gap: Spacing.xs },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, borderColor: Colors.border.strong },
  checkboxDone: { backgroundColor: Colors.racingRed, borderColor: Colors.racingRed },
  trailingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  percent: { color: Colors.text.muted, fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  titulo: { color: Colors.text.primary, fontSize: FontSize.md, fontWeight: FontWeight.medium },
  tituloDone: { color: Colors.text.muted, textDecorationLine: 'line-through' },
  tituloRejected: { color: Colors.text.muted },
  meta: { color: Colors.text.muted, fontSize: FontSize.base, marginTop: 2 },
  pendingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  rejectedDot: { backgroundColor: Colors.racingRed },
});
