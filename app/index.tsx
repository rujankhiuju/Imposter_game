import React, { useState } from 'react';
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
import { SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../constants/theme';
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

  const [showCategories, setShowCategories] = useState(false);

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
  const selectedCategory = categories.find((c) => c.id === settings.categoryId) ?? categories[0];

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
          value={selectedCategory?.name ?? 'None'}
          onPress={() => setShowCategories((v) => !v)}
          rightContent={
            <Chip label={showCategories ? 'Done' : 'Change'} small selected={showCategories} />
          }
        />
        {showCategories && (
          <View style={[styles.categoryPanel, SHADOWS.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.chipRow}>
              {categories.map((c) => (
                <Chip
                  key={c.id}
                  label={c.name}
                  selected={settings.categoryId === c.id}
                  onPress={() => setSettings({ categoryId: c.id })}
                />
              ))}
            </View>
            <PillButton
              title="Manage Categories"
              variant="outline"
              onPress={() => router.push('/manage/categories')}
              style={styles.panelButton}
            />
          </View>
        )}

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

        <PillButton
          title="▶  Start Game"
          onPress={handleStartGame}
          fullWidth
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
  categoryPanel: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  panelButton: {
    marginTop: SPACING.md,
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
