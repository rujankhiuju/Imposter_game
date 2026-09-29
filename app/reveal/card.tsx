import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeContainer } from '../../components/layout/SafeContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { PillButton } from '../../components/ui/PillButton';
import { useGameStore } from '../../store/gameStore';
import { useGameFlow } from '../../hooks/useGameFlow';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, RADIUS, TYPOGRAPHY, TOUCH_TARGET, SHADOWS } from '../../constants/theme';

const HOLD_MS = 300;

/**
 * Secret role card. Static pastel card (no 3D flip):
 * press and HOLD to reveal the word — release to hide it again.
 * A camera-shy pattern that keeps the word off-screen between peeks.
 */
export default function RevealCardScreen() {
  const { colors } = useTheme();
  const { players, currentPlayerIndex, categoryHint, secretWord } = useGameStore();
  const { beginReveal, proceedToNextPlayer } = useGameFlow();

  const params = useLocalSearchParams<{ player?: string }>();
  const playerIndex = params.player !== undefined ? Number(params.player) : Number(currentPlayerIndex);
  const currentPlayer = players[playerIndex];

  const [revealData, setRevealData] = useState<{
    word: string;
    hint: string;
    isImposter: boolean;
  } | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [hasSeen, setHasSeen] = useState(false);
  const [holdTimer, setHoldTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const isImposter = revealData?.isImposter ?? currentPlayer?.role === 'imposter';

  const startHold = () => {
    if (revealed) return;
    const timer = setTimeout(() => {
      const data = revealData ?? beginReveal();
      setRevealData(data);
      setRevealed(true);
      setHasSeen(true);
    }, HOLD_MS);
    setHoldTimer(timer);
  };

  const cancelHold = () => {
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }
    setRevealed(false);
  };

  const handleNext = () => {
    const hasNext = proceedToNextPlayer();
    if (hasNext) {
      router.push(`/reveal/handoff?next=${playerIndex + 1}`);
    } else {
      router.push('/discussion/timer');
    }
  };

  if (!currentPlayer) {
    return null;
  }

  const cardColor = isImposter ? colors.revealImposter : colors.revealCivilian;
  // Show live store values once revealed (beginReveal keeps the store in sync).
  const shownWord = revealed ? (revealData?.word ?? secretWord) : '';
  const shownHint = revealed ? (revealData?.hint ?? categoryHint) : '';

  return (
    <SafeContainer avoidKeyboard={false}>
      <ScreenHeader title="IMPOSTER" showBack onBack={() => router.back()} />

      <View style={styles.container}>
        <View style={styles.turnBlock}>
          <Text style={[styles.turnLabel, { color: colors.textMuted }]}>
            PLAYER {playerIndex + 1} OF {players.length}
          </Text>
          <Text style={[styles.playerName, { color: colors.textPrimary }]} numberOfLines={1}>
            {currentPlayer.name}
          </Text>
        </View>

        <Pressable
          onPressIn={startHold}
          onPressOut={cancelHold}
          style={({ pressed }) => [
            styles.card,
            SHADOWS.raised,
            {
              backgroundColor: cardColor,
              transform: [{ scale: pressed && revealed ? 1.02 : 1 }],
            },
          ]}
          accessibilityLabel="Secret card, press and hold to reveal"
          accessibilityRole="button"
        >
          <View style={styles.cardTop}>
            <Text style={[styles.cardName, { color: colors.onReveal }]} numberOfLines={1}>
              {currentPlayer.name.toUpperCase()}
            </Text>
          </View>

          {revealed ? (
            isImposter ? (
              <View style={styles.revealBlock}>
                <Text style={styles.imposterText}>YOU ARE THE IMPOSTER!</Text>
                <View style={styles.hintPill}>
                  <Text style={[styles.hintText, { color: colors.textPrimary }]}>{shownHint}</Text>
                </View>
                <Text style={styles.bluffHint}>
                  Bluff your way through — you don’t know the word!
                </Text>
              </View>
            ) : (
              <View style={styles.revealBlock}>
                <View style={styles.wordPill}>
                  <Text style={styles.wordText} numberOfLines={3}>{shownWord}</Text>
                </View>
                <Text style={styles.hintCaption}>{shownHint}</Text>
              </View>
            )
          ) : (
            <View style={styles.revealBlock}>
              <View style={styles.holdBadge}>
                <Text style={styles.holdBadgeText}>✊</Text>
              </View>
              <Text style={[styles.holdText, { color: colors.onReveal }]}>PRESS &amp; HOLD TO REVEAL</Text>
            </View>
          )}

          <View style={styles.cardBottom}>
            <Text style={[styles.cardFooter, { color: colors.onReveal }]}>
              {isImposter ? 'IMPOSTER' : 'CIVILIAN'}
            </Text>
          </View>
        </Pressable>

        <Text style={[styles.helper, { color: colors.textSecondary }]}>
          {hasSeen
            ? 'Pass the phone on when you remember it.'
            : 'Hold the card until the word appears, memorise it, then let go.'}
        </Text>

        {hasSeen && (
          <PillButton
            title={playerIndex + 1 < players.length ? 'Next Player  ▸▸' : 'Start Discussion  ▸▸'}
            variant="solid"
            onPress={handleNext}
            fullWidth
          />
        )}
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  turnBlock: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  turnLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.xs,
    letterSpacing: 2,
  },
  playerName: {
    fontFamily: TYPOGRAPHY.fontFamily.display,
    fontSize: TYPOGRAPHY.fontSize.xxl,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    aspectRatio: 0.72,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTop: {
    alignItems: 'center',
    width: '100%',
  },
  cardName: {
    fontFamily: TYPOGRAPHY.fontFamily.display,
    fontSize: TYPOGRAPHY.fontSize.xl,
    letterSpacing: 1,
    textAlign: 'center',
  },
  cardBottom: {
    alignItems: 'center',
    width: '100%',
  },
  cardFooter: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.xs,
    letterSpacing: 3,
    opacity: 0.6,
  },
  revealBlock: {
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  holdBadge: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  holdBadgeText: {
    fontSize: 32,
  },
  holdText: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.sm,
    letterSpacing: 2,
    textAlign: 'center',
  },
  wordPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    width: '100%',
    alignItems: 'center',
  },
  wordText: {
    fontFamily: TYPOGRAPHY.fontFamily.display,
    fontSize: TYPOGRAPHY.fontSize.xl,
    color: '#111114',
    textAlign: 'center',
  },
  hintCaption: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: '#111114',
    opacity: 0.7,
    textAlign: 'center',
  },
  imposterText: {
    fontFamily: TYPOGRAPHY.fontFamily.display,
    fontSize: TYPOGRAPHY.fontSize.xl,
    color: '#D32F2F',
    textAlign: 'center',
    lineHeight: 34,
  },
  hintPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  hintText: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.sm,
    textAlign: 'center',
  },
  bluffHint: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: '#111114',
    opacity: 0.7,
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
  },
  helper: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.fontSize.sm,
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
    minHeight: TOUCH_TARGET.minimum - SPACING.sm,
  },
});
