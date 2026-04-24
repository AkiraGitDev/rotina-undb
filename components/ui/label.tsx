import { PropsWithChildren } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

import { Colors, FontSize, FontWeight, LetterSpacing } from '@/constants/theme';

export function Label({ children, style }: PropsWithChildren<{ style?: TextStyle }>) {
  return <Text style={[styles.label, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    letterSpacing: LetterSpacing.wide,
    color: Colors.text.placeholder,
    textTransform: 'uppercase',
  },
});
