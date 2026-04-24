import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { TaskPriority } from '@/types/task';

export function PriorityDot({ priority, size = 8 }: { priority?: TaskPriority; size?: number }) {
  const color = priority ? Colors.priority[priority] : Colors.priority.baixa;
  return <View style={[styles.dot, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]} />;
}

const styles = StyleSheet.create({
  dot: {},
});
