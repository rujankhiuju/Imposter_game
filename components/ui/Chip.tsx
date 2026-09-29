import React from 'react';
import { Pressable, Text, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

interface ChipProps {
  label: string;
  /** When set, chip becomes a toggle with selected styling. */
  selected?: boolean;
  onPress?: () => void;
  small?: boolean;
  style?: ViewStyle;
}

/** Rounded gray name/option chip (player names, categories). */
export const Chip: React.FC<ChipProps> = ({ label, selected, onPress, small, style }) => {
  const { colors } = useTheme();

  const backgroundColor = selected ? colors.primary : colors.chipBg;
  const textColor = selected ? colors.primaryText : colors.textPrimary;

  if (!onPress) {
    return (
      <View
        style={[
          styles.chip,
          small && styles.chipSmall,
          { backgroundColor },
          style,
        ]}
      >
        <Text style={[styles.label, small && styles.labelSmall, { color: textColor }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      style={({ pressed }) => [
        styles.chip,
        small && styles.chipSmall,
        { backgroundColor, opacity: pressed ? 0.85 : 1 },
        style,
      ]}
    >
      <Text style={[styles.label, small && styles.labelSmall, { color: textColor }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 140,
  },
  chipSmall: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 5,
    minHeight: 28,
  },
  label: {
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  labelSmall: {
    fontSize: TYPOGRAPHY.fontSize.xs,
  },
});
