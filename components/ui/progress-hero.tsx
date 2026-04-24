import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, FontSize, FontWeight, Gradients, LetterSpacing, Radius, Spacing } from '@/constants/theme';

type ProgressHeroProps = {
  label: string;
  value: number;
  caption?: string;
};

export function ProgressHero({ label, value, caption }: ProgressHeroProps) {
  return (
    <LinearGradient
      colors={Gradients.heroProgress as unknown as [string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.hero}
    >
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.percent}>%</Text>
      </View>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    shadowColor: Colors.racingRed,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 32,
    shadowOpacity: 0.2,
    elevation: 6,
  },
  label: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    letterSpacing: LetterSpacing.wide,
    textTransform: 'uppercase',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: Spacing.sm,
  },
  value: {
    color: Colors.white,
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.medium,
    letterSpacing: LetterSpacing.tight,
    lineHeight: FontSize.xxl + 2,
  },
  percent: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FontSize.lg,
    fontWeight: FontWeight.medium,
    marginLeft: 4,
    marginBottom: 6,
  },
  caption: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FontSize.base,
    marginTop: Spacing.sm,
  },
});
