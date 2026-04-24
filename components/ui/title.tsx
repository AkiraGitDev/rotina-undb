import { PropsWithChildren } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

import { Colors, FontSize, FontWeight, LetterSpacing } from '@/constants/theme';

export function Title({ children, style }: PropsWithChildren<{ style?: TextStyle }>) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.medium,
    letterSpacing: -0.6,
    color: Colors.text.primary,
  },
});
