import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeContainer } from '../../components/layout/SafeContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { PillButton } from '../../components/ui/PillButton';
import { InputField } from '../../components/ui/InputField';
import { ColorPicker } from '../../components/ui/ColorPicker';
import { useCategoryStore } from '../../store/categoryStore';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, RADIUS, TYPOGRAPHY, NEON_PALETTE, SHADOWS } from '../../constants/theme';
import { Category } from '../../types';

export default function ManageCategoriesScreen() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const { colors } = useTheme();

  const [showCreate, setShowCreate] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryHint, setNewCategoryHint] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(NEON_PALETTE[0]);

  const handleCreate = () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Category name cannot be empty');
      return;
    }
    if (!newCategoryHint.trim()) {
      Alert.alert('Error', 'Hint prefix cannot be empty');
      return;
    }
    addCategory({
      name: newCategoryName.trim(),
      hintPrefix: newCategoryHint.trim(),
      neonColor: newCategoryColor,
      words: [],
    });
    setShowCreate(false);
    setNewCategoryName('');
    setNewCategoryHint('');
    setNewCategoryColor(NEON_PALETTE[0]);
  };

  const handleUpdate = (id: string, name: string, hint: string, color: string) => {
    if (!name.trim() || !hint.trim()) return;
    updateCategory(id, { name: name.trim(), hintPrefix: hint.trim(), neonColor: color });
    setEditingCategory(null);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Category', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteCategory(id) },
    ]);
  };

  const customCategories = categories.filter((c) => c.isCustom);
  const builtinCategories = categories.filter((c) => !c.isCustom);

  const renderCategoryItem = (category: Category) => (
    <View
      key={category.id}
      style={[styles.categoryItem, SHADOWS.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={styles.categoryInfo}>
        <Text style={[styles.categoryName, { color: colors.textPrimary }]}>{category.name}</Text>
        <Text style={[styles.categoryHint, { color: colors.textSecondary }]}>
          Hint: “{category.hintPrefix}”
        </Text>
        <Text style={[styles.categoryWordCount, { color: colors.textMuted }]}>
          {category.words.length} words
        </Text>
      </View>

      {editingCategory === category.id ? (
        <EditCategoryForm
          category={category}
          onSave={(name, hint, color) => handleUpdate(category.id, name, hint, color)}
          onCancel={() => setEditingCategory(null)}
        />
      ) : (
        <View style={styles.categoryActions}>
          <PillButton
            title="Words"
            variant="outline"
            onPress={() => router.push(`/manage/words?category=${category.id}`)}
            style={styles.smallButton}
          />
          {category.isCustom && (
            <>
              <PillButton
                title="Edit"
                variant="outline"
                onPress={() => setEditingCategory(category.id)}
                style={styles.smallButton}
              />
              <PillButton
                title="Delete"
                variant="danger"
                onPress={() => handleDelete(category.id)}
                style={styles.smallButton}
              />
            </>
          )}
        </View>
      )}
    </View>
  );

  return (
    <SafeContainer avoidKeyboard={true}>
      <View style={styles.container}>
        <ScreenHeader title="CATEGORIES" onBack={() => router.back()} showBack />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {showCreate && (
            <View style={[styles.createForm, SHADOWS.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.formTitle, { color: colors.textMuted }]}>CREATE NEW CATEGORY</Text>
              <InputField
                label="Category Name"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                placeholder="e.g., Video Games"
              />
              <InputField
                label="Hint Prefix"
                value={newCategoryHint}
                onChangeText={setNewCategoryHint}
                placeholder="e.g., It's a game..."
              />
              <View style={styles.colorPickerSection}>
                <Text style={[styles.colorPickerLabel, { color: colors.textMuted }]}>ACCENT COLOR</Text>
                <ColorPicker selectedColor={newCategoryColor} onSelect={setNewCategoryColor} columns={5} />
              </View>
              <View style={styles.formActions}>
                <PillButton title="Cancel" variant="outline" onPress={() => setShowCreate(false)} style={styles.formActionButton} />
                <PillButton title="Create" onPress={handleCreate} style={styles.formActionButton} />
              </View>
            </View>
          )}

          {!showCreate && (
            <PillButton title="+ Create New Category" variant="outline" onPress={() => setShowCreate(true)} fullWidth style={styles.createButton} />
          )}

          {builtinCategories.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>BUILT-IN CATEGORIES</Text>
              <View style={styles.categoryList}>{builtinCategories.map(renderCategoryItem)}</View>
            </View>
          )}

          {customCategories.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>CUSTOM CATEGORIES</Text>
              <View style={styles.categoryList}>{customCategories.map(renderCategoryItem)}</View>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeContainer>
  );
}

interface EditCategoryFormProps {
  category: Category;
  onSave: (name: string, hint: string, color: string) => void;
  onCancel: () => void;
}

const EditCategoryForm = React.memo(function EditCategoryForm({ category, onSave, onCancel }: EditCategoryFormProps) {
  const { colors } = useTheme();
  const [name, setName] = useState(category.name);
  const [hint, setHint] = useState(category.hintPrefix);
  const [color, setColor] = useState(category.neonColor);

  return (
    <View style={[styles.editForm, { borderTopColor: colors.border }]}>
      <InputField label="Name" value={name} onChangeText={setName} />
      <InputField label="Hint Prefix" value={hint} onChangeText={setHint} />
      <View style={styles.colorPickerSection}>
        <Text style={[styles.colorPickerLabel, { color: colors.textMuted }]}>ACCENT COLOR</Text>
        <ColorPicker selectedColor={color} onSelect={setColor} columns={5} />
      </View>
      <View style={styles.formActions}>
        <PillButton title="Cancel" variant="outline" onPress={onCancel} style={styles.formActionButton} />
        <PillButton title="Save" onPress={() => onSave(name, hint, color)} style={styles.formActionButton} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
    flexGrow: 1,
  },
  createForm: {
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.md,
  },
  formTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  colorPickerSection: {
    marginTop: SPACING.sm,
  },
  colorPickerLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  formActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  formActionButton: {
    flex: 1,
  },
  createButton: {
    marginBottom: SPACING.xl,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: SPACING.md,
  },
  categoryList: {
    gap: SPACING.md,
  },
  categoryItem: {
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.md,
  },
  categoryInfo: {
    gap: 2,
  },
  categoryName: {
    fontFamily: TYPOGRAPHY.fontFamily.headingMedium,
    fontSize: TYPOGRAPHY.fontSize.md,
  },
  categoryHint: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.fontSize.xs,
    marginTop: SPACING.xs,
  },
  categoryWordCount: {
    fontFamily: TYPOGRAPHY.fontFamily.body,
    fontSize: TYPOGRAPHY.fontSize.xs,
    marginTop: SPACING.xs,
  },
  categoryActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  smallButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    minHeight: 40,
  },
  editForm: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    gap: SPACING.md,
  },
});
