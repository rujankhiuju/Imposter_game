import React from 'react';
import { SafeAreaView, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface SafeContainerProps {
  children: React.ReactNode;
  style?: any;
  avoidKeyboard?: boolean;
  flex?: boolean;
}

export const SafeContainer: React.FC<SafeContainerProps> = ({
  children,
  style,
  avoidKeyboard = true,
  flex = true,
}) => {
  const { colors } = useTheme();

  const content = (
    <View style={[styles.container, flex && styles.flex, { backgroundColor: colors.background }, style]}>
      {children}
    </View>
  );

  if (avoidKeyboard) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoiding}
          keyboardVerticalOffset={0}
        >
          {content}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {content}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
});
