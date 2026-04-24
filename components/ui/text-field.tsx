import { forwardRef } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { Colors, FontSize, FontWeight, LetterSpacing, Radius, Spacing } from '@/constants/theme';

type TextFieldProps = TextInputProps & {
  label?: string;
  helper?: string;
  error?: string;
};

export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, helper, error, style, ...rest },
  ref,
) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        ref={ref}
        placeholderTextColor={Colors.text.placeholder}
        style={[styles.input, error ? styles.inputError : null, style]}
        autoCapitalize="none"
        autoCorrect={false}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.xs + 2,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    letterSpacing: LetterSpacing.wide,
    color: Colors.text.muted,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border.strong,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    color: Colors.text.primary,
    fontSize: FontSize.md,
    backgroundColor: 'transparent',
  },
  inputError: {
    borderColor: Colors.racingRed,
  },
  helper: {
    fontSize: FontSize.sm,
    color: Colors.text.placeholder,
  },
  error: {
    fontSize: FontSize.sm,
    color: Colors.racingRed,
  },
});
