import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeContainer } from '../../components/layout/SafeContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { PillButton } from '../../components/ui/PillButton';
import { InputField } from '../../components/ui/InputField';
import { useGameStore } from '../../store/gameStore';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { GAME_CONSTANTS } from '../../constants/game';

export default function PlayerNamesScreen() {
  const { settings, setSettings, players } = useGameStore();
  const { colors } = useTheme();
  const { trigger: haptic } = useHaptics();
  // Only edits are stored; untouched names fall back to the store value.
  const [nameEdits, setNameEdits] = useState<Record<number, string>>({});

  const getName = (index: number): string =>
    nameEdits[index] ?? players[index]?.name ?? `Player ${index + 1}`;

  const handleNameChange = (index: number, name: string) => {
    setNameEdits((prev) => ({
      ...prev,
      [index]: name.slice(0, GAME_CONSTANTS.MAX_CUSTOM_NAME_LENGTH),
    }));
  };

  const changePlayerCount = (delta: number) => {
    const next = Math.max(
      GAME_CONSTANTS.MIN_PLAYERS,
      Math.min(GAME_CONSTANTS.MAX_PLAYERS, settings.playerCount + delta)
    );
    if (next !== settings.playerCount) {
      haptic('light');
      setSettings({ playerCount: next });
    }
  };

  const handleSave = () => {
    const updatedPlayers = players.map((p, i) => ({
      ...p,
      name: getName(i).trim() || `Player ${i + 1}`,
    }));
    useGameStore.setState({ players: updatedPlayers });
    router.back();
  };

  const handleSkip = () => {
    router.back();
  };

  return (
    <SafeContainer avoidKeyboard={true}>
      <View style={styles.container}>
        <ScreenHeader title="PLAYERS" onBack={handleSkip} showBack />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Set the squad size, then rename anyone who wants a nickname.
            </Text>
          </View>

          <View
            style={[styles.countRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={[styles.countLabel, { color: colors.textPrimary }]}>PLAYERS</Text>
            <View style={styles.stepper}>
              <Pressable
                onPress={() => changePlayerCount(-1)}
                disabled={settings.playerCount <= GAME_CONSTANTS.MIN_PLAYERS}
                style={[styles.stepperButton, { backgroundColor: colors.chipBg }]}
                accessibilityLabel="Remove player"
              >
                <Text style={[styles.stepperButtonText, { color: colors.textPrimary }]}>−</Text>
              </Pressable>
              <Text style={[styles.countValue, { color: colors.textPrimary }]}>
                {settings.playerCount}
              </Text>
              <Pressable
                onPress={() => changePlayerCount(1)}
                disabled={settings.playerCount >= GAME_CONSTANTS.MAX_PLAYERS}
                style={[styles.stepperButton, { backgroundColor: colors.chipBg }]}
                accessibilityLabel="Add player"
              >
                <Text style={[styles.stepperButtonText, { color: colors.textPrimary }]}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.namesList}>
            {Array.from({ length: settings.playerCount }, (_, i) => (
              <View key={i} style={styles.nameItem}>
                <Text style={[styles.playerNumber, { color: colors.textMuted }]}>
                  PLAYER {i + 1}
                </Text>
                <InputField
                  value={getName(i)}
                  onChangeText={(text) => handleNameChange(i, text)}
                  placeholder={`Player ${i + 1}`}
                  maxLength={GAME_CONSTANTS.MAX_CUSTOM_NAME_LENGTH}
                />
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <PillButton title="Skip" variant="outline" onPress={handleSkip} style={styles.footerButton} />
          <PillButton title="Save & Continue" onPress={handleSave} style={styles.footerButton} />
        </View>
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
  header: {
    marginBottom: SPACING.lg,
  },
  headerSubtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.fontSize.md,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.fontSize.md * TYPOGRAPHY.lineHeight.relaxed,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.lg,
  },
  countLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.sm,
    letterSpacing: 1,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  stepperButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonText: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.xl,
    lineHeight: TYPOGRAPHY.fontSize.xl + 6,
  },
  countValue: {
    fontFamily: TYPOGRAPHY.fontFamily.display,
    fontSize: TYPOGRAPHY.fontSize.xl,
    minWidth: 36,
    textAlign: 'center',
  },
  namesList: {
    gap: SPACING.md,
  },
  nameItem: {
    gap: SPACING.xs,
  },
  playerNumber: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
    borderTopWidth: 1,
  },
  footerButton: {
    flex: 1,
  },
});
