import { PropsWithChildren, ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

type ListItemProps = PropsWithChildren<{
  onPress?: () => void;
  leading?: ReactNode;
  trailing?: ReactNode;
  divider?: boolean;
}>;

export function ListItem({ children, onPress, leading, trailing, divider = true }: ListItemProps) {
  const content = (
    <View style={[styles.row, divider && styles.divider]}>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={styles.body}>{children}</View>
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
    </View>
  );
  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => (pressed ? styles.pressed : undefined)}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border.subtle,
  },
  leading: {},
  body: { flex: 1 },
  trailing: {},
  pressed: { opacity: 0.6 },
});
