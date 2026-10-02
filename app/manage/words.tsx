import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeContainer } from '../../components/layout/SafeContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { PillButton } from '../../components/ui/PillButton';
import { InputField } from '../../components/ui/InputField';
import { useCategoryStore } from '../../store/categoryStore';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants/theme';

export default function ManageWordsScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const { categories, addWord, removeWord, getAllWords } = useCategoryStore();
  const { colors } = useTheme();

  const selectedCategory = categories.find((c) => c.id === category);
  const [newWord, setNewWord] = useState('');
  // Derived on render — the store subscription re-renders this screen
  // whenever built-in or custom words change.
  const words = selectedCategory ? getAllWords(selectedCategory.id) : [];

  const handleAddWord = () => {
    if (!newWord.trim()) {
      Alert.alert('Error', 'Word cannot be empty');
      return;
    }
    if (newWord.trim().length > 30) {
      Alert.alert('Error', 'Word must be 30 characters or fewer');
      return;
    }
    if (words.some((w) => w.toLowerCase() === newWord.trim().toLowerCase())) {
      Alert.alert('Error', 'This word already exists');
      return;
    }
    if (selectedCategory) {
      addWord(selectedCategory.id, newWord.trim());
      setNewWord('');
    }
  };

  const handleRemoveWord = (word: string) => {
    if (selectedCategory) {
      removeWord(selectedCategory.id, word);
    }
  };

  if (!selectedCategory) {
    return (
      <SafeContainer>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>Category not found</Text>
        </View>
      </SafeContainer>
    );
  }

  const isBuiltInWord = (word: string) => selectedCategory.words.includes(word);

  return (
    <SafeContainer avoidKeyboard={true}>
      <View style={styles.container}>
        <ScreenHeader
          title={selectedCategory.name.toUpperCase()}
          onBack={() => router.back()}
          showBack
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.addWordForm, SHADOWS.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <InputField
              label="Add New Word"
              value={newWord}
              onChangeText={setNewWord}
              placeholder="Enter a word..."
              onSubmitEditing={handleAddWord}
              returnKeyType="done"
            />
            <PillButton title="Add Word" onPress={handleAddWord} fullWidth style={styles.addButton} />
          </View>

          <View style={styles.wordList}>
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
              WORDS ({words.length})
            </Text>
            {words.length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                No words yet. Add some above!
              </Text>
            ) : (
              words.map((word) => (
                <View
                  key={word}
                  style={[styles.wordItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <Text style={[styles.wordText, { color: colors.textPrimary }]} numberOfLines={2}>
                    {word}
                    {isBuiltInWord(word) && (
                      <Text style={[styles.builtinBadge, { color: colors.textMuted }]}>BUILT-IN</Text>
                    )}
                  </Text>
                  {!isBuiltInWord(word) && (
                    <TouchableOpacity
                      onPress={() => handleRemoveWord(word)}
                      style={styles.removeButton}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityLabel={`Remove ${word}`}
                    >
                      <Text style={[styles.removeButtonText, { color: colors.danger }]}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* Direct jump back to the main screen while browsing words. */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <PillButton
            title="⌂  Main Screen"
            variant="solid"
            onPress={() => router.replace('/')}
            fullWidth
          />
        </View>
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
    flexGrow: 1,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    borderTopWidth: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.fontSize.md,
    textAlign: 'center',
  },
  addWordForm: {
    marginBottom: SPACING.xl,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.md,
  },
  addButton: {
    marginTop: SPACING.xs,
  },
  wordList: {
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: SPACING.md,
  },
  wordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    gap: SPACING.sm,
  },
  wordText: {
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    fontSize: TYPOGRAPHY.fontSize.md,
    flex: 1,
    flexWrap: 'wrap',
  },
  builtinBadge: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.xs,
    marginLeft: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  removeButton: {
    padding: SPACING.xs,
  },
  removeButtonText: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.lg,
  },
});
