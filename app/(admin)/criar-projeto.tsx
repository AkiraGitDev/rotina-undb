import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { GradientButton } from '@/components/ui/gradient-button';
import { KeyboardSafeScroll } from '@/components/ui/keyboard-safe-scroll';
import { Label } from '@/components/ui/label';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { Title } from '@/components/ui/title';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { useProjectsStore } from '@/lib/store/projects';
import { useCurrentUser, useUsersStore } from '@/lib/store/users';

const EMOJIS = ['🚀', '📱', '✨', '🎯', '⚡', '🛠️', '📊', '🌐'];

export default function CriarProjetoScreen() {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const users = useUsersStore((s) => s.users);
  const createProject = useProjectsStore((s) => s.createProject);

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [emoji, setEmoji] = useState(EMOJIS[0]!);
  const [membroIds, setMembroIds] = useState<string[]>([currentUser.id]);
  const [erro, setErro] = useState<string | null>(null);

  function toggleMembro(id: string) {
    setMembroIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handleCriar() {
    setErro(null);
    if (!nome.trim()) {
      setErro('Informe o nome do projeto.');
      return;
    }
    createProject({
      nome: nome.trim(),
      descricao: descricao.trim() || undefined,
      emoji,
      membroIds,
    });
    router.back();
  }

  return (
    <Screen>
      <KeyboardSafeScroll contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <Label>Novo projeto</Label>
            <Title style={styles.title}>Criar projeto</Title>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Label>Ícone</Label>
              <View style={styles.emojiRow}>
                {EMOJIS.map((e) => {
                  const selected = emoji === e;
                  return (
                    <Pressable
                      key={e}
                      onPress={() => setEmoji(e)}
                      style={[styles.emojiChip, selected && styles.emojiChipSelected]}
                    >
                      <Text style={styles.emojiText}>{e}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <TextField
              label="Nome"
              placeholder="Ex: App Rotina"
              autoCapitalize="words"
              value={nome}
              onChangeText={setNome}
              error={erro ?? undefined}
            />
            <TextField
              label="Descrição"
              placeholder="Opcional"
              value={descricao}
              onChangeText={setDescricao}
              multiline
              numberOfLines={3}
            />

            <View style={styles.field}>
              <Label>Membros</Label>
              <View style={styles.membersList}>
                {users.map((u) => {
                  const selected = membroIds.includes(u.id);
                  return (
                    <Pressable
                      key={u.id}
                      onPress={() => toggleMembro(u.id)}
                      style={styles.memberRow}
                    >
                      <Avatar nome={u.nome} color={u.avatarColor} size={32} />
                      <View style={styles.memberInfo}>
                        <Text style={styles.memberName}>{u.nome}</Text>
                        <Text style={styles.memberRole}>{u.role === 'admin' ? 'Admin' : 'Colaborador'}</Text>
                      </View>
                      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                        {selected ? <View style={styles.checkboxFill} /> : null}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <GradientButton label="Criar projeto" onPress={handleCriar} style={styles.cta} />
          </View>
      </KeyboardSafeScroll>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingVertical: Spacing.xxl, gap: Spacing.xl },
  header: { gap: Spacing.sm },
  title: { marginTop: Spacing.sm },
  form: { gap: Spacing.lg },
  field: { gap: Spacing.sm },
  emojiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  emojiChip: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border.strong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiChipSelected: { borderColor: Colors.racingRed, backgroundColor: 'rgba(255,31,41,0.08)' },
  emojiText: { fontSize: 22 },
  membersList: { gap: 0 },
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
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.border.strong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: { borderColor: Colors.racingRed, backgroundColor: Colors.racingRed },
  checkboxFill: { width: 10, height: 10, borderRadius: 2, backgroundColor: Colors.white },
  cta: { marginTop: Spacing.md },
});
