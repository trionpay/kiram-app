import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

const TYPES = [
  {
    id: 'transfer',
    icon: '🏠',
    title: 'Kira & Aidat',
    subtitle: 'Ev sahibi veya apartman yönetimine IBAN ile ödeme',
    screen: 'PaymentAmount',
  },
  {
    id: 'bill',
    icon: '⚡',
    title: 'Fatura Öde',
    subtitle: 'Elektrik, su, doğalgaz, internet ve telekomünikasyon',
    screen: 'BillPayment',
  },
];

export function PaymentTypeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Ne ödemek{'\n'}istiyorsunuz?</Text>
        <Text style={styles.subtitle}>Ödeme türünüzü seçin.</Text>

        <View style={styles.cards}>
          {TYPES.map(t => (
            <TouchableOpacity
              key={t.id}
              style={styles.card}
              onPress={() => navigation.navigate(t.screen)}
              activeOpacity={0.8}
            >
              <View style={styles.cardIcon}>
                <Text style={styles.cardIconText}>{t.icon}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{t.title}</Text>
                <Text style={styles.cardSubtitle}>{t.subtitle}</Text>
              </View>
              <Text style={styles.cardArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: screenPaddingHorizontal, paddingTop: spacing.md },
  back: { alignSelf: 'flex-start', marginBottom: spacing.xl },
  backArrow: { fontSize: 24, color: colors.textPrimary },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xxl },

  cards: { gap: spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
    borderRadius: 20,
    padding: spacing.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: spacing.md,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardIconText: { fontSize: 26 },
  cardContent: { flex: 1 },
  cardTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: 4 },
  cardSubtitle: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 18 },
  cardArrow: { fontSize: 22, color: colors.textTertiary },
});
