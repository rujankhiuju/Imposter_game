import React from 'react';
import { Pressable, Text, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants/theme';

interface ListRowProps {
  /** Leading emoji, e.g. '👇'. */
  emoji?: string;
  label: string;
  /** Right-aligned value text (e.g. "1 Imposter"). */
  value?: string;
  /** Optional chips rendered under the label. */
  children?: React.ReactNode;
  onPress?: () => void;
  rightContent?: React.ReactNode;
  showChevron?: boolean;
  style?: ViewStyle;
}

/**
 * White grouped-list row with emoji + uppercase label + chevron,
 * matching the Imposter Who? home screen.
 */
export const ListRow: React.FC<ListRowProps> = ({
  emoji,
  label,
  value,
  children,
  onPress,
  rightContent,
  showChevron = true,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        SHADOWS.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed && onPress ? 0.85 : 1,
        },
        style,
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
        <View style={styles.rightCluster}>
          {value ? (
            <Text style={[styles.value, { color: colors.textSecondary }]} numberOfLines={1}>
              {value}
            </Text>
          ) : null}
          {rightContent}
          {showChevron && onPress ? (
            <Text style={[styles.chevron, { color: colors.textMuted }]}>›</Text>
          ) : null}
        </View>
      </View>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    minHeight: 28,
  },
  emoji: {
    fontSize: 16,
  },
  label: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    flexShrink: 0,
  },
  rightCluster: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
  },
  value: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.fontSize.sm,
    maxWidth: 180,
  },
  chevron: {
    fontSize: 22,
    lineHeight: 22,
    fontWeight: '600',
  },
});
