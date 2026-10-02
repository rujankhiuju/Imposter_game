import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeContainer } from '../../components/layout/SafeContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { Chip } from '../../components/ui/Chip';
import { PillButton } from '../../components/ui/PillButton';
import { useGameStore } from '../../store/gameStore';
import { useCategoryStore } from '../../store/categoryStore';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants/theme';

/**
 * Imposter Who?-style category picker: white list cards with emoji rows,
 * checkmark multi-select, Select all / Clear. At least one category must
 * stay selected to start a game.
 */
export default function SelectCategoriesScreen() {
  const { colors } = useTheme();
  const { settings, setSettings } = useGameStore();
  const { categories } = useCategoryStore();
  const { trigger: haptic } = useHaptics();

  const selectedIds = settings.categoryIds;
  const hasSelection = selectedIds.length > 0;

  // Never mutate the stored array — build a new one on every change.
  const toggleCategory = (id: string) => {
    haptic('light');
    const next = selectedIds.includes(id)
      ? selectedIds.filter((c) => c !== id)
      : [...selectedIds, id];
    setSettings({ categoryIds: next });
  };

  const selectAllCategories = () => {
    haptic('light');
    setSettings({ categoryIds: categories.map((c) => c.id) });
  };

  const clearCategorySelection = () => {
    haptic('light');
    setSettings({ categoryIds: [] });
  };

  return (
    <SafeContainer avoidKeyboard={false}>
      <View style={styles.container}>
        <ScreenHeader title="CATEGORIES" onBack={() => router.back()} showBack />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Choose one or more categories for the game.
          </Text>

          <View style={styles.chipRow}>
            <Chip label="Select all" small onPress={selectAllCategories} />
            <Chip label="Clear" small onPress={clearCategorySelection} />
          </View>

          <View style={styles.list}>
            {categories.map((c) => {
              const selected = selectedIds.includes(c.id);
              return (
                <Pressable
                  key={c.id}
                  onPress={() => toggleCategory(c.id)}
                  style={({ pressed }) => [
                    styles.categoryRow,
                    SHADOWS.card,
                    {
                      backgroundColor: colors.surface,
                      borderColor: selected ? colors.primary : colors.border,
                      borderWidth: selected ? 2 : 1,
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={c.name}
                >
                  <Text style={styles.categoryEmoji}>{c.emoji ?? '🏷️'}</Text>
                  <Text
                    style={[styles.categoryName, { color: colors.textPrimary }]}
                    numberOfLines={1}
                  >
                    {c.name}
                  </Text>
                  <View
                    style={[
                      styles.checkCircle,
                      { borderColor: selected ? colors.primary : colors.borderLight },
                      selected && { backgroundColor: colors.primary },
                    ]}
                  >
                    {selected && <Text style={styles.checkText}>✓</Text>}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {!hasSelection && (
            <Text style={[styles.warning, { color: colors.danger }]}>
              Select at least one category to play.
            </Text>
          )}

          <PillButton
            title="Manage Categories"
            variant="outline"
            onPress={() => router.push('/manage/categories')}
            fullWidth
            style={styles.manageButton}
          />
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
  },
  subtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.fontSize.sm,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  list: {
    gap: SPACING.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryName: {
    flex: 1,
    fontFamily: TYPOGRAPHY.fontFamily.headingMedium,
    fontSize: TYPOGRAPHY.fontSize.md,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    fontSize: 14,
    lineHeight: 16,
    color: '#111114',
    fontWeight: '700',
  },
  warning: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.fontSize.sm,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
  manageButton: {
    marginTop: SPACING.xl,
  },
});
