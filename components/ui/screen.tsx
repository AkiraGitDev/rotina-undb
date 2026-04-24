import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Spacing } from '@/constants/theme';

type ScreenProps = PropsWithChildren<{
  padded?: boolean;
  style?: ViewStyle;
}>;

export function Screen({ children, padded = true, style }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={[styles.root, padded && styles.padded, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.pitchBlack,
  },
  root: {
    flex: 1,
    backgroundColor: Colors.pitchBlack,
  },
  padded: {
    paddingHorizontal: Spacing.lg,
  },
});