import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, screenPaddingHorizontal } from '../theme';

export function ScreenContainer({ children, style }) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: screenPaddingHorizontal,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
