import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeContainer } from '../../components/layout/SafeContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { PillButton } from '../../components/ui/PillButton';
import { VoteButton } from '../../components/ui/VoteButton';
import { useGameStore } from '../../store/gameStore';
import { useGameFlow } from '../../hooks/useGameFlow';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { useSound } from '../../hooks/useSound';
import { SPACING, TYPOGRAPHY } from '../../constants/theme';

/**
 * Sequential pass-the-phone voting: one voter at a time picks someone
 * else. Vote counts stay hidden until the staggered reveal.
 */
export default function VotingScreen() {
  const { players } = useGameStore();
  const { finishVoting } = useGameFlow();
  const { colors } = useTheme();
  const { trigger: haptic } = useHaptics();
  const { play } = useSound();

  const [showResults, setShowResults] = useState(false);
  const [revealIndex, setRevealIndex] = useState(0);
  const lastFinishPressRef = useRef(0);

  const currentVoter = players.find((p) => !p.hasVoted);
  const allVoted = !currentVoter;
  const votedCount = players.filter((p) => p.hasVoted).length;

  useEffect(() => {
    if (!showResults) return;

    const timer = setInterval(() => {
      setRevealIndex((prev) => {
        if (prev >= players.length - 1) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
    return () => clearInterval(timer);
  }, [showResults, players.length]);

  const handleVote = (targetId: number) => {
    if (!currentVoter || showResults || targetId === currentVoter.id) return;

    useGameStore.getState().setVote(currentVoter.id, targetId);
    useGameStore.getState().incrementVotes(targetId);
    haptic('light');
    play('voteSubmit');
  };

  const handleReveal = () => {
    if (!allVoted) return;
    setShowResults(true);
    haptic('heavy');
    play('reveal');
  };

  const handleFinish = () => {
    // Throttle double taps; only score the round once (re-opening the
    // results screen via back navigation must not score again).
    const now = Date.now();
    if (now - lastFinishPressRef.current < 800) return;
    lastFinishPressRef.current = now;

    if (useGameStore.getState().phase !== 'results') {
      finishVoting();
    }
    router.push('/results');
  };

  const revealOrder = [...players].sort((a, b) => b.votesReceived - a.votesReceived);
  const displayPlayers = showResults ? revealOrder : players;

  return (
    <SafeContainer avoidKeyboard={false}>
      <View style={styles.container}>
        <ScreenHeader title="VOTING" />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {!showResults && currentVoter && (
            <Text style={[styles.instruction, { color: colors.textSecondary }]}>
              Pass the phone to{' '}
              <Text style={[styles.voterName, { color: colors.textPrimary }]}>{currentVoter.name}</Text>
              {' — '}tap who they think the Imposter is ({votedCount}/{players.length} voted).
            </Text>
          )}
          {!showResults && allVoted && (
            <Text style={[styles.instruction, { color: colors.textSecondary }]}>
              All votes are in. Reveal to see who got caught!
            </Text>
          )}
          {showResults && (
            <Text style={[styles.instruction, { color: colors.textSecondary }]}>
              The votes are in…
            </Text>
          )}

          <View style={styles.playersList}>
            {displayPlayers.map((player, index) => {
              const isRowRevealing = showResults && revealIndex >= index;
              return (
                <VoteButton
                  key={player.id}
                  playerName={player.name}
                  isSelected={false}
                  voteCount={isRowRevealing ? player.votesReceived : 0}
                  onPress={() => handleVote(player.id)}
                  disabled={showResults || player.id === currentVoter?.id}
                  isRevealing={isRowRevealing}
                  revealRole={isRowRevealing ? player.role : undefined}
                />
              );
            })}
          </View>

          {!showResults && allVoted && (
            <PillButton title="Reveal Votes" onPress={handleReveal} fullWidth style={styles.actionButton} />
          )}

          {showResults && (
            <PillButton
              title="See Results  ▸▸"
              variant="solid"
              onPress={handleFinish}
              fullWidth
              style={styles.actionButton}
            />
          )}
        </ScrollView>
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
    flexGrow: 1,
  },
  playersList: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  instruction: {
    textAlign: 'center',
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.fontSize.md,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    lineHeight: TYPOGRAPHY.fontSize.md * TYPOGRAPHY.lineHeight.relaxed,
  },
  voterName: {
    fontFamily: TYPOGRAPHY.fontFamily.headingMedium,
  },
  actionButton: {
    maxWidth: 320,
    alignSelf: 'center',
  },
});
