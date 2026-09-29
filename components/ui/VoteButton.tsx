import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, RADIUS, TYPOGRAPHY, TOUCH_TARGET, SHADOWS } from '../../constants/theme';

interface VoteButtonProps {
  playerName: string;
  isSelected: boolean;
  voteCount: number;
  onPress: () => void;
  disabled?: boolean;
  isRevealing?: boolean;
  revealRole?: 'civilian' | 'imposter';
}

/**
 * Flat player tile for voting: white card, name centered.
 * On reveal, tiles turn lime (civilian) or red (imposter).
 */
export const VoteButton: React.FC<VoteButtonProps> = ({
  playerName,
  isSelected,
  voteCount,
  onPress,
  disabled = false,
  isRevealing = false,
  revealRole,
}) => {
  const { colors } = useTheme();

  let backgroundColor = colors.surface;
  let borderColor = colors.border;
  let textColor = colors.textPrimary;

  if (isRevealing) {
    if (revealRole === 'imposter') {
      backgroundColor = colors.danger;
      borderColor = colors.danger;
      textColor = '#FFFFFF';
    } else {
      backgroundColor = colors.primary;
      borderColor = colors.primary;
      textColor = colors.primaryText;
    }
  } else if (isSelected) {
    backgroundColor = colors.primary;
    borderColor = colors.primary;
    textColor = colors.primaryText;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isRevealing}
      style={({ pressed }) => [
        styles.button,
        SHADOWS.card,
        {
          backgroundColor,
          borderColor,
          borderWidth: 2,
          opacity: disabled && !isRevealing ? 0.6 : pressed ? 0.9 : 1,
          minHeight: TOUCH_TARGET.comfortable,
        },
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected, disabled: disabled || isRevealing }}
    >
      <View style={styles.content}>
        <Text style={[styles.nameText, { color: textColor }]} numberOfLines={1}>
          {playerName}
        </Text>
        <View style={styles.metaRow}>
          {!isRevealing && voteCount > 0 && (
            <View style={[styles.voteBadge, { backgroundColor: colors.chipBg }]}>
              <Text style={[styles.voteBadgeText, { color: colors.textSecondary }]}>
                {voteCount} vote{voteCount !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
          {isRevealing && revealRole === 'imposter' && (
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>IMPOSTER</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    marginVertical: SPACING.xs,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameText: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.lg,
    flex: 1,
    marginRight: SPACING.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  voteBadge: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  voteBadgeText: {
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
  },
  roleBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: '#FFFFFF',
  },
  roleBadgeText: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: '#E53935',
    letterSpacing: 1,
  },
});
