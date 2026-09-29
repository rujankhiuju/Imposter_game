import React from 'react';
import { View, TextInput, StyleSheet, Text, TextInputProps } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, RADIUS, TYPOGRAPHY, TOUCH_TARGET } from '../../constants/theme';

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  value?: string;
}

/** Flat white text field with a bold border — Imposter Who? setup style. */
export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  style,
  ...props
}) => {
  const { colors } = useTheme();

  const borderColor = error ? colors.danger : colors.borderLight;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      )}
      <View
        style={[
          styles.inputWrapper,
          { backgroundColor: colors.surface, borderColor },
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            {
              color: colors.textPrimary,
              paddingLeft: leftIcon ? SPACING.md : SPACING.lg,
              paddingRight: rightIcon ? SPACING.md : SPACING.lg,
              minHeight: TOUCH_TARGET.comfortable,
            },
          ]}
          {...props}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
          cursorColor={colors.textPrimary}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      {error && (
        <Text style={[styles.helperText, { color: colors.danger }]}>{error}</Text>
      )}
      {helperText && !error && (
        <Text style={[styles.helperText, { color: colors.textMuted }]}>{helperText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.xs,
    width: '100%',
  },
  label: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    borderWidth: 2,
  },
  input: {
    flex: 1,
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.fontSize.md,
    paddingVertical: SPACING.md,
  },
  iconLeft: {
    paddingLeft: SPACING.md,
  },
  iconRight: {
    paddingRight: SPACING.md,
  },
  helperText: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.fontSize.xs,
    marginTop: SPACING.xs,
  },
});
