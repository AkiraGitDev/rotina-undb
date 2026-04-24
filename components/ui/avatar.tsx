import { StyleSheet, Text, View } from 'react-native';

import { Colors, FontWeight, Radius } from '@/constants/theme';

type AvatarProps = {
  nome: string;
  color?: string;
  size?: number;
};

function initials(nome: string): string {
  const parts = nome.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export function Avatar({ nome, color = Colors.midnightViolet, size = 32 }: AvatarProps) {
  return (
    <View style={[styles.root, { width: size, height: size, backgroundColor: color, borderRadius: Radius.sm }]}>
      <Text style={[styles.text, { fontSize: size * 0.4 }]}>{initials(nome)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.white,
    fontWeight: FontWeight.medium,
  },
});
