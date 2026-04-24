import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';

type ProgressBarProps = {
  value: number;
  color?: string;
  height?: number;
};

export function ProgressBar({ value, color = Colors.white, height = 3 }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View style={[styles.fill, { width: `${clamped}%`, backgroundColor: color, borderRadius: height / 2 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
