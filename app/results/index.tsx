import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeContainer } from '../../components/layout/SafeContainer';
import { PillButton } from '../../components/ui/PillButton';
import { ScoreRow } from '../../components/ui/ScoreRow';
import { useGameStore } from '../../store/gameStore';
import { useScoreStore } from '../../store/scoreStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useTheme } from '../../hooks/useTheme';
import { determineWinner } from '../../utils/scoring';
import { SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants/theme';

/**
 * Round summary. Scoring already happened in `finishVoting()` when the
 * voting screen advanced here — this screen only displays the outcome.
 */
export default function ResultsScreen() {
  const { players, round, resetGame, resetSession } = useGameStore();
  const { resetSessionScores } = useScoreStore();
  const { setFirstLaunch } = useSettingsStore();
  const { colors } = useTheme();

  const winner = determineWinner(players);
  const imposters = players.filter((p) => p.role === 'imposter');
  const impostersCaught = imposters.some((p) => p.votesReceived > 0);
  const winnerText = winner === 'imposters' ? 'IMPOSTERS WIN!' : 'CIVILIANS WIN!';
  const bannerColor = winner === 'imposters' ? colors.revealImposter : colors.primary;
  const bannerTextColor = winner === 'imposters' ? '#111114' : colors.primaryText;

  const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore);

  const handleNextRound = () => {
    resetGame();
    router.push('/reveal/card');
  };

  const handleEndParty = () => {
    Alert.alert(
      'End Party?',
      'This will reset all scores and start a new session.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Party',
          style: 'destructive',
          onPress: () => {
            resetSession();
            resetSessionScores();
            setFirstLaunch(false);
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <SafeContainer avoidKeyboard={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={[styles.winnerBanner, SHADOWS.raised, { backgroundColor: bannerColor }]}>
            <Text style={[styles.winnerText, { color: bannerTextColor }]}>{winnerText}</Text>
            <Text style={[styles.roundText, { color: bannerTextColor }]}>Round {round} complete</Text>
          </View>
          <Text style={[styles.secretWord, { color: colors.textSecondary }]}>
            Imposter{imposters.length > 1 ? 's' : ''}: {imposters.map((p) => p.name).join(', ')}
            {!impostersCaught && ' — not caught!'}
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.reveals}>
            {players.map((player) => (
              <View
                key={player.id}
                style={[
                  styles.revealCard,
                  SHADOWS.card,
                  {
                    backgroundColor: colors.surface,
                    borderColor: player.role === 'imposter' ? colors.revealImposter : colors.border,
                    borderWidth: player.role === 'imposter' ? 2 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.revealRole,
                    {
                      backgroundColor:
                        player.role === 'imposter' ? colors.revealImposter : colors.primary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.revealRoleText,
                      { color: player.role === 'imposter' ? '#D32F2F' : colors.primaryText },
                    ]}
                  >
                    {player.role.toUpperCase()}
                  </Text>
                </View>
                <Text style={[styles.revealName, { color: colors.textPrimary }]} numberOfLines={1}>
                  {player.name}
                </Text>
                <Text style={[styles.revealWord, { color: colors.textSecondary }]} numberOfLines={2}>
                  {player.role === 'imposter' ? '(didn’t know it)' : player.word}
                </Text>
                <Text
                  style={[
                    styles.revealVotes,
                    { color: player.votesReceived > 0 ? colors.danger : colors.textMuted },
                  ]}
                >
                  {player.votesReceived} vote{player.votesReceived !== 1 ? 's' : ''}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.scoresSection}>
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>SCORES</Text>
            {sortedPlayers.map((player, index) => (
              <ScoreRow
                key={player.id}
                playerName={player.name}
                totalScore={player.totalScore}
                roundScore={player.roundScore}
                role={player.role}
                isWinner={
                  player.role === (winner === 'imposters' ? 'imposter' : 'civilian') &&
                  player.votesReceived === 0
                }
                index={index}
              />
            ))}
          </View>
        </ScrollView>

        <View style={[styles.actions, { borderTopColor: colors.border }]}>
          <PillButton title="▶  Next Round" onPress={handleNextRound} fullWidth style={styles.actionButton} />
          <PillButton title="End Party" variant="outline" onPress={handleEndParty} fullWidth style={styles.actionButton} />
        </View>
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  winnerBanner: {
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
  },
  winnerText: {
    fontFamily: TYPOGRAPHY.fontFamily.display,
    fontSize: TYPOGRAPHY.fontSize.xxl,
    textAlign: 'center',
    letterSpacing: 1,
  },
  roundText: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: SPACING.xs,
    opacity: 0.8,
  },
  secretWord: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.fontSize.sm,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  reveals: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  revealCard: {
    width: 140,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    gap: 2,
  },
  revealRole: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.xs,
  },
  revealRoleText: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  revealName: {
    fontFamily: TYPOGRAPHY.fontFamily.headingMedium,
    fontSize: TYPOGRAPHY.fontSize.md,
    textAlign: 'center',
  },
  revealWord: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.fontSize.sm,
    textAlign: 'center',
    minHeight: 34,
  },
  revealVotes: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scoresSection: {
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.sm,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: SPACING.md,
  },
  actions: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
    borderTopWidth: 1,
  },
  actionButton: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
  },
});
