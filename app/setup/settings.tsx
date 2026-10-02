import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeContainer } from '../../components/layout/SafeContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { PillButton } from '../../components/ui/PillButton';
import { useSettingsStore } from '../../store/settingsStore';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants/theme';

export default function SettingsScreen() {
  const {
    enableSounds,
    enableHaptics,
    enableAccessibility,
    setEnableSounds,
    setEnableHaptics,
    setEnableAccessibility,
    setTheme,
    resetSettings,
  } = useSettingsStore();
  const { colors, mode } = useTheme();

  const handleReset = () => {
    resetSettings();
  };

  const switchProps = (value: boolean, onChange: (v: boolean) => void) => ({
    value,
    onValueChange: onChange,
    thumbColor: value ? colors.primary : colors.textMuted,
    trackColor: { false: colors.borderLight, true: `${colors.primary}66` },
  });

  return (
    <SafeContainer avoidKeyboard={false}>
      <View style={styles.container}>
        <ScreenHeader title="SETTINGS" onBack={() => router.back()} showBack />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.section, SHADOWS.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>APPEARANCE</Text>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Theme</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Light is the classic Imposter Who? look
                </Text>
              </View>
              <View style={[styles.segment, { backgroundColor: colors.chipBg }]}>
                {(['light', 'dark'] as const).map((option) => {
                  const active = mode === option;
                  return (
                    <Pressable
                      key={option}
                      onPress={() => setTheme(option)}
                      style={[
                        styles.segmentItem,
                        active && { backgroundColor: active ? colors.surface : 'transparent' },
                      ]}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                    >
                      <Text
                        style={[
                          styles.segmentText,
                          { color: active ? colors.textPrimary : colors.textSecondary },
                        ]}
                      >
                        {option === 'light' ? '☀️ Light' : '🌙 Dark'}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>

          <View style={[styles.section, SHADOWS.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>GAMEPLAY</Text>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Sound Effects</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Play sounds for card reveals, votes, and round results
                </Text>
              </View>
              <Switch {...switchProps(enableSounds, setEnableSounds)} />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Haptic Feedback</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Vibration on card reveal, vote, and timer warnings
                </Text>
              </View>
              <Switch {...switchProps(enableHaptics, setEnableHaptics)} />
            </View>
          </View>

          <View style={[styles.section, SHADOWS.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>ACCESSIBILITY</Text>

            <View style={[styles.settingRow, styles.settingRowLast]}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Screen Reader Support</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Enable VoiceOver/TalkBack optimizations (experimental)
                </Text>
              </View>
              <Switch {...switchProps(enableAccessibility, setEnableAccessibility)} />
            </View>
          </View>

          <View style={styles.section}>
            <PillButton title="Reset All Settings" variant="danger" onPress={handleReset} fullWidth />
          </View>

          <View style={[styles.versionInfo, { borderTopColor: colors.border, borderTopWidth: 1 }]}>
            <Text style={[styles.versionText, { color: colors.textMuted }]}>Imposter v1.0.1</Text>
            <Text style={[styles.versionText, { color: colors.textMuted }]}>Built with Expo &amp; React Native</Text>
          </View>
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
  section: {
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
  },
  sectionTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: SPACING.lg,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  settingRowLast: {
    marginBottom: 0,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.headingMedium,
    fontSize: TYPOGRAPHY.fontSize.md,
    marginBottom: SPACING.xs,
  },
  settingDescription: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: TYPOGRAPHY.fontSize.sm * TYPOGRAPHY.lineHeight.relaxed,
  },
  segment: {
    flexDirection: 'row',
    borderRadius: RADIUS.full,
    padding: 4,
    gap: 4,
  },
  segmentItem: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  segmentText: {
    fontFamily: TYPOGRAPHY.fontFamily.headingMedium,
    fontSize: TYPOGRAPHY.fontSize.xs,
  },
  versionInfo: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
    marginTop: SPACING.lg,
  },
  versionText: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.fontSize.xs,
    marginBottom: SPACING.xs,
  },
});
