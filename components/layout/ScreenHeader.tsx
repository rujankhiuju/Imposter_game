import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, TYPOGRAPHY, TOUCH_TARGET } from '../../constants/theme';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  onClose?: () => void;
  showBack?: boolean;
  showClose?: boolean;
  rightContent?: React.ReactNode;
}

/**
 * Centered uppercase display-font header with back/close affordances,
 * matching the Imposter Who? in-game headers.
 */
export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onBack,
  onClose,
  showBack = false,
  showClose = false,
  rightContent,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBack && onBack && (
          <Pressable
            onPress={onBack}
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={TOUCH_TARGET.minimum}
          >
            <Text style={[styles.navGlyph, { color: colors.textPrimary }]}>←</Text>
          </Pressable>
        )}
        {showClose && onClose && (
          <Pressable
            onPress={onClose}
            style={styles.backButton}
            accessibilityLabel="Close"
            accessibilityRole="button"
            hitSlop={TOUCH_TARGET.minimum}
          >
            <Text style={[styles.navGlyph, { color: colors.textPrimary }]}>✕</Text>
          </Pressable>
        )}
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
        {title}
      </Text>
      <View style={[styles.right, { width: showBack || showClose ? 48 : 0 }]}>
        {rightContent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    minHeight: 60,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  right: {
    width: 48,
    justifyContent: 'flex-end',
  },
  backButton: {
    padding: SPACING.sm,
  },
  navGlyph: {
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.xl,
    lineHeight: TYPOGRAPHY.fontSize.xl + 4,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamily.display,
    fontSize: TYPOGRAPHY.fontSize.md,
    textAlign: 'center',
    flex: 1,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
