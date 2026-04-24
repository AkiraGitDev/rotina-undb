import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Label } from '@/components/ui/label';
import { ListItem } from '@/components/ui/list-item';
import { PriorityDot } from '@/components/ui/priority-dot';
import { Screen } from '@/components/ui/screen';
import { Title } from '@/components/ui/title';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { mockProjects, mockTasks, mockUsers } from '@/lib/mock';
import { TaskStatus } from '@/types/task';

const STATUS_LABEL: Record<TaskStatus, string> = {
  rascunho: 'Rascunho',
  pendente: 'Pendente',
  aprovada: 'Aprovada',
  rejeitada: 'Rejeitada',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
};

export default function TarefasAdminScreen() {
  const router = useRouter();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Label>Gerenciar</Label>
          <Title style={styles.title}>Tarefas</Title>
        </View>

        <View style={styles.section}>
          {mockTasks.map((t) => {
            const projeto = mockProjects.find((p) => p.id === t.projetoId);
            const responsavel = mockUsers.find((u) => u.id === t.responsavelId);
            return (
              <ListItem
                key={t.id}
                onPress={() => router.push(`/tarefa/${t.id}`)}
                leading={<PriorityDot priority={t.prioridade} />}
                trailing={<Text style={styles.status}>{STATUS_LABEL[t.status]}</Text>}
              >
                <Text style={styles.titulo}>{t.titulo}</Text>
                <Text style={styles.meta}>
                  {projeto?.nome}
                  {responsavel ? ` · ${responsavel.nome.split(' ')[0]}` : ''}
                </Text>
              </ListItem>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: Spacing.lg, paddingBottom: Spacing.xxl, gap: Spacing.lg },
  header: { gap: Spacing.xs },
  title: { marginTop: 2 },
  section: { marginTop: Spacing.sm },
  titulo: { color: Colors.text.primary, fontSize: FontSize.md, fontWeight: FontWeight.medium },
  meta: { color: Colors.text.muted, fontSize: FontSize.base, marginTop: 2 },
  status: { color: Colors.text.muted, fontSize: FontSize.sm },
});
