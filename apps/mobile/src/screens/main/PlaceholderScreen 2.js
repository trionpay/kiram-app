import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../../theme';

/** Henüz geliştirilmemiş sekmeler için geçici ekran. */
export function PlaceholderScreen({ title, subtitle }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.center}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Yakında</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{subtitle ?? 'Bu ekran yakında hazır olacak.'}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  badge: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  badgeText: { ...typography.caption, color: colors.accent },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.sm, textAlign: 'center' },
  sub: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
});
