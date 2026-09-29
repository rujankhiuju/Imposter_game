import React from 'react';
import { Pressable, Text, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, RADIUS, TYPOGRAPHY, TOUCH_TARGET } from '../../constants/theme';

export type PillVariant = 'primary' | 'solid' | 'outline' | 'danger';

interface PillButtonProps {
  title: string;
  onPress: () => void;
  variant?: PillVariant;
  disabled?: boolean;
  fullWidth?: boolean;
  /** Leading glyph, e.g. '▶' or '||>'. */
  icon?: string;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Flat pill button in the Imposter Who? style:
 * - primary: lime green, black uppercase text
 * - solid: black pill (white in dark theme), white uppercase text
 * - outline: bordered ghost pill
 * - danger: red pill
 */
export const PillButton: React.FC<PillButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  icon,
  style,
  testID,
}) => {
  const { colors } = useTheme();

  const backgroundColor =
    variant === 'primary'
      ? disabled
        ? colors.chipBg
        : colors.primary
      : variant === 'solid'
      ? colors.pillBg
      : variant === 'danger'
      ? colors.danger
      : 'transparent';

  const textColor =
    variant === 'primary'
      ? colors.primaryText
      : variant === 'solid'
      ? colors.pillText
      : variant === 'danger'
      ? '#FFFFFF'
      : colors.textPrimary;

  const borderColor =
    variant === 'outline' ? colors.borderLight : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          borderColor,
          borderWidth: variant === 'outline' ? 2 : 0,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      <View style={styles.content}>
        {icon ? <Text style={[styles.icon, { color: textColor }]}>{icon}</Text> : null}
        <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.full,
    minHeight: TOUCH_TARGET.comfortable,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.sm,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  icon: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
});
