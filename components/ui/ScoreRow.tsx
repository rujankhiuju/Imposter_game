import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants/theme';

interface ScoreRowProps {
  playerName: string;
  totalScore: number;
  roundScore: number;
  role?: 'civilian' | 'imposter';
  isWinner?: boolean;
  index?: number;
}

/** White score row with role badge, round delta, and total. */
export const ScoreRow: React.FC<ScoreRowProps> = ({
  playerName,
  totalScore,
  roundScore,
  role,
  isWinner = false,
  index = 0,
}) => {
  const { colors } = useTheme();

  const formatScore = (score: number) => (score % 1 === 0 ? score.toString() : score.toFixed(1));

  const roleBadgeColors =
    role === 'imposter'
      ? { bg: colors.danger, fg: '#FFFFFF' }
      : { bg: colors.primary, fg: colors.primaryText };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 80).duration(350)}
      style={[
        styles.row,
        SHADOWS.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.nameContainer}>
        <Text style={[styles.nameText, { color: colors.textPrimary }]} numberOfLines={1}>
          {playerName}
        </Text>
        {role && (
          <View style={[styles.roleBadge, { backgroundColor: roleBadgeColors.bg }]}>
            <Text style={[styles.roleText, { color: roleBadgeColors.fg }]}>{role.toUpperCase()}</Text>
          </View>
        )}
        {isWinner && (
          <View style={[styles.winnerBadge, { backgroundColor: colors.chipBg }]}>
            <Text style={[styles.winnerText, { color: colors.textPrimary }]}>WINNER</Text>
          </View>
        )}
      </View>
      <View style={styles.scores}>
        <View style={styles.scoreColumn}>
          <Text style={[styles.scoreLabel, { color: colors.textMuted }]}>ROUND</Text>
          <Text
            style={[
              styles.scoreValue,
              { color: roundScore > 0 ? colors.success : colors.textSecondary },
            ]}
          >
            {roundScore > 0 ? '+' : ''}
            {formatScore(roundScore)}
          </Text>
        </View>
        <View style={styles.scoreColumn}>
          <Text style={[styles.scoreLabel, { color: colors.textMuted }]}>TOTAL</Text>
          <Text style={[styles.scoreValue, { color: colors.textPrimary }]}>
            {formatScore(totalScore)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginVertical: SPACING.xs,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
    flexWrap: 'wrap',
    marginRight: SPACING.sm,
  },
  nameText: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.md,
  },
  roleBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  roleText: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  winnerBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  winnerText: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  scores: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  scoreColumn: {
    alignItems: 'flex-end',
  },
  scoreLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scoreValue: {
    fontFamily: TYPOGRAPHY.fontFamily.display,
    fontSize: TYPOGRAPHY.fontSize.md,
  },
});
