import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeContainer } from '../../components/layout/SafeContainer';
import { PillButton } from '../../components/ui/PillButton';
import { TimerRing } from '../../components/ui/TimerRing';
import { useGameStore } from '../../store/gameStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../../hooks/useSound';
import { SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants/theme';
import { GAME_CONSTANTS } from '../../constants/game';

export default function DiscussionTimerScreen() {
  const { settings, players, secretWord, phase, setPhase } = useGameStore();
  const { enableHaptics, enableSounds } = useSettingsStore();
  const { colors } = useTheme();
  const { trigger: haptic } = useHaptics();
  const { play } = useSound();

  const [timeRemaining, setTimeRemaining] = useState(settings.roundTimerSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const warnedRef = useRef(false);
  const endedRef = useRef(false);

  // Ticking countdown (pure state updates only).
  useEffect(() => {
    if (phase !== 'discussion') return;

    const interval = setInterval(() => {
      if (isPaused) return;
      setTimeRemaining((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, isPaused]);

  // Warning + round-end side effects, driven by the current time value.
  useEffect(() => {
    if (phase !== 'discussion') return;

    if (timeRemaining <= 0) {
      if (!endedRef.current) {
        endedRef.current = true;
        if (enableHaptics) haptic('heavy');
        if (enableSounds) play('reveal');
        setPhase('voting');
        router.push('/voting');
      }
      return;
    }

    if (timeRemaining <= GAME_CONSTANTS.TIMER_WARNING_THRESHOLD && !warnedRef.current) {
      warnedRef.current = true;
      if (enableHaptics) haptic('warning');
      if (enableSounds) play('timerWarning');
    }
  }, [timeRemaining, phase, enableHaptics, enableSounds, haptic, play, setPhase]);

  const handleSkip = () => {
    setPhase('voting');
    haptic('heavy');
    play('reveal');
    router.push('/voting');
  };

  const progress = 1 - timeRemaining / settings.roundTimerSeconds;
  const imposterCount = players.filter((p) => p.role === 'imposter').length;

  return (
    <SafeContainer avoidKeyboard={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.phaseLabel, { color: colors.textMuted }]}>DISCUSS!</Text>
          <View style={[styles.wordCard, SHADOWS.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.wordCaption, { color: colors.textMuted }]}>THE WORD IS</Text>
            <Text style={[styles.wordText, { color: colors.textPrimary }]}>{secretWord}</Text>
          </View>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>
            {imposterCount} Imposter{imposterCount > 1 ? 's' : ''} hiding among {players.length} players
          </Text>
        </View>

        <TimerRing
          duration={settings.roundTimerSeconds}
          progress={progress}
          isPaused={isPaused}
          size={260}
          strokeWidth={12}
        />

        <View style={styles.controls}>
          <PillButton
            title={isPaused ? '▶ Resume' : '⏸ Pause'}
            variant="outline"
            onPress={() => {
              setIsPaused(!isPaused);
              haptic('light');
            }}
            style={styles.controlButton}
          />
          <PillButton
            title="Skip to Vote  ▸▸"
            variant="solid"
            onPress={handleSkip}
            style={styles.controlButton}
          />
        </View>

        <Text style={[styles.instruction, { color: colors.textSecondary }]}>
          Discuss who you think the Imposter is. Vote when you’re ready.
        </Text>
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'center',
    gap: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  phaseLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.display,
    fontSize: TYPOGRAPHY.fontSize.xl,
    letterSpacing: 2,
  },
  wordCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    width: '100%',
  },
  wordCaption: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.xs,
    letterSpacing: 2,
  },
  wordText: {
    fontFamily: TYPOGRAPHY.fontFamily.display,
    fontSize: TYPOGRAPHY.fontSize.lg,
    marginTop: SPACING.xs,
  },
  meta: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.fontSize.sm,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  controlButton: {
    flex: 1,
    maxWidth: 180,
  },
  instruction: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.fontSize.md,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.fontSize.md * TYPOGRAPHY.lineHeight.relaxed,
  },
});
