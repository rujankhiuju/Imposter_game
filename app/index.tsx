import React from 'react';
import { View, ScrollView, Text, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeContainer } from '../components/layout/SafeContainer';
import { PillButton } from '../components/ui/PillButton';
import { ListRow } from '../components/ui/ListRow';
import { Chip } from '../components/ui/Chip';
import { useGameStore } from '../store/gameStore';
import { useCategoryStore } from '../store/categoryStore';
import { useGameFlow } from '../hooks/useGameFlow';
import { useTheme } from '../hooks/useTheme';
import { useHaptics } from '../hooks/useHaptics';
import { SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { GAME_CONSTANTS } from '../constants/game';

const TIMER_PRESETS = [30, 60, 90, 120, 180, 300];

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export default function HomeScreen() {
  const { colors } = useTheme();
  const { settings, setSettings, players } = useGameStore();
  const { categories } = useCategoryStore();
  const { startGame } = useGameFlow();
  const { trigger: haptic } = useHaptics();

  const handleStartGame = () => {
    const result = startGame();
    if (result.valid) {
      router.push('/reveal/card');
    } else {
      Alert.alert('Invalid Settings', result.errors.join('\n'));
    }
  };

  const cycleImposters = () => {
    haptic('light');
    const max = Math.min(GAME_CONSTANTS.MAX_IMPOSTERS, settings.playerCount - 1);
    const next = settings.imposterCount >= max ? GAME_CONSTANTS.MIN_IMPOSTERS : settings.imposterCount + 1;
    setSettings({ imposterCount: next });
  };

  const cycleTimer = () => {
    haptic('light');
    const idx = TIMER_PRESETS.indexOf(settings.roundTimerSeconds);
    const next = TIMER_PRESETS[(idx + 1) % TIMER_PRESETS.length];
    setSettings({ roundTimerSeconds: next });
  };

  const activePlayers = players.slice(0, settings.playerCount);
  const selectedIds = settings.categoryIds;
  const hasSelection = selectedIds.length > 0;
  const categoryValue = !hasSelection
    ? 'None'
    : selectedIds.length === categories.length
      ? 'All Categories'
      : selectedIds.length === 1
        ? categories.find((c) => c.id === selectedIds[0])?.name ?? '1 selected'
        : `${selectedIds.length} selected`;

  return (
    <SafeContainer avoidKeyboard={false}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.logoBlock}>
          <Text style={[styles.logo, { color: colors.textPrimary }]}>IMPOSTER</Text>
          <View style={[styles.logoAccent, { backgroundColor: colors.primary }]} />
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>WHO’S HIDING?</Text>
        </View>

        <ListRow
          emoji="👇"
          label="Players"
          onPress={() => router.push('/setup/player-names')}
        >
          <View style={styles.chipRow}>
            {activePlayers.map((p) => (
              <Chip key={p.id} label={p.name} small />
            ))}
          </View>
        </ListRow>

        <ListRow
          emoji="🏷️"
          label="Categories"
          value={categoryValue}
          onPress={() => router.push('/setup/categories')}
        />

        <ListRow
          emoji="🕵️"
          label="Imposters"
          value={`${settings.imposterCount} Imposter${settings.imposterCount > 1 ? 's' : ''}`}
          onPress={cycleImposters}
        />

        <ListRow
          emoji="⏰"
          label="Time Limit"
          value={formatTime(settings.roundTimerSeconds)}
          onPress={cycleTimer}
        />

        {!hasSelection && (
          <Text style={[styles.selectionWarning, { color: colors.danger }]}>
            Select at least one category to play.
          </Text>
        )}

        <PillButton
          title="▶  Start Game"
          onPress={handleStartGame}
          fullWidth
          disabled={!hasSelection}
          style={styles.startButton}
        />
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <PillButton
          title="⚙  Settings"
          variant="outline"
          onPress={() => router.push('/setup/settings')}
          fullWidth
        />
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
    flexGrow: 1,
  },
  logoBlock: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logo: {
    fontFamily: TYPOGRAPHY.fontFamily.display,
    fontSize: 44,
    letterSpacing: 1,
  },
  logoAccent: {
    width: 64,
    height: 8,
    borderRadius: RADIUS.full,
    marginTop: SPACING.sm,
  },
  tagline: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.xs,
    letterSpacing: 3,
    marginTop: SPACING.sm,
    textTransform: 'uppercase',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  selectionWarning: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.fontSize.sm,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
  startButton: {
    marginTop: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderTopWidth: 1,
  },
});
