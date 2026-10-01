import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeContainer } from '../../components/layout/SafeContainer';
import { PillButton } from '../../components/ui/PillButton';
import { useGameStore } from '../../store/gameStore';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants/theme';

/**
 * "Pass the phone to …" interstitial before each player's reveal card.
 * The next player taps the pill when they're holding the phone.
 */
export default function HandoffScreen() {
  const { next } = useLocalSearchParams<{ next: string }>();
  const nextIndex = parseInt(next || '0', 10);
  const { colors } = useTheme();

  const { players } = useGameStore();
  const nextPlayer = players[nextIndex];

  if (!nextPlayer) {
    return null;
  }

  return (
    <SafeContainer avoidKeyboard={false}>
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(300)} style={styles.content}>
          <Text style={[styles.passLabel, { color: colors.textSecondary }]}>PASS THE PHONE TO</Text>
          <View style={[styles.nameCard, SHADOWS.raised, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.emoji, { backgroundColor: colors.primary }]}>🤝</Text>
            <Text style={[styles.playerName, { color: colors.textPrimary }]} numberOfLines={1}>
              {nextPlayer.name}
            </Text>
            <Text style={[styles.playerMeta, { color: colors.textMuted }]}>
              Player {nextIndex + 1} of {players.length}
            </Text>
          </View>
          <Text style={[styles.hint, { color: colors.textSecondary }]}>
            No peeking! Their card is secret.
          </Text>
        </Animated.View>

        <PillButton
          title={`I'm ${nextPlayer.name} — Continue`}
          variant="solid"
          onPress={() => router.push(`/reveal/card?player=${nextIndex}`)}
          fullWidth
        />
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
    gap: SPACING.xl,
  },
  content: {
    alignItems: 'center',
    gap: SPACING.lg,
  },
  passLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.sm,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  nameCard: {
    width: '100%',
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  emoji: {
    fontSize: 40,
    width: 72,
    height: 72,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    textAlign: 'center',
    lineHeight: 76,
  },
  playerName: {
    fontFamily: TYPOGRAPHY.fontFamily.display,
    fontSize: TYPOGRAPHY.fontSize.xxl,
    textAlign: 'center',
  },
  playerMeta: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  hint: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.fontSize.sm,
    textAlign: 'center',
  },
});
