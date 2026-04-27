import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

// Mock işlemler
const MOCK_TRANSACTIONS = [
  { id: '1', name: 'Apartman Yönetimi', amount: '2.500,00', status: 'success', date: 'Bugün, 10:32' },
  { id: '2', name: 'Apartman Aidatı', amount: '850,00', status: 'success', date: 'Dün, 14:15' },
  { id: '3', name: 'Kira Ödemesi', amount: '12.000,00', status: 'failed', date: '15 Mar' },
];

const StatusDot = ({ status }) => (
  <View
    style={[
      styles.dot,
      { backgroundColor: status === 'success' ? colors.success : colors.error },
    ]}
  />
);

export function DashboardScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Üst başlık */}
        <View style={styles.topRow}>
          <View>
            <Text style={styles.greeting}>Merhaba 👋</Text>
            <Text style={styles.name}>Kullanıcı</Text>
          </View>
          <TouchableOpacity style={styles.avatarBtn}>
            <Text style={styles.avatarText}>K</Text>
          </TouchableOpacity>
        </View>

        {/* Hızlı ödeme CTA */}
        <View style={styles.heroCard}>
          <View style={styles.accentBar} />
          <Text style={styles.heroLabel}>Yeni ödeme</Text>
          <Text style={styles.heroTitle}>Hızlı ve güvenli{'\n'}para transferi</Text>
          <Button
            title="Ödeme Başlat"
            onPress={() => navigation.navigate('Payment')}
            style={styles.heroBtn}
          />
        </View>

        {/* Hızlı menü */}
        <View style={styles.quickRow}>
          {[
            { icon: '↗', label: 'Gönder' },
            { icon: '📋', label: 'Alıcılar' },
            { icon: '🗂', label: 'Geçmiş' },
            { icon: '🏢', label: 'Aidat' },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={styles.quickItem}>
              <View style={styles.quickIcon}>
                <Text style={styles.quickIconText}>{item.icon}</Text>
              </View>
              <Text style={styles.quickLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Son işlemler */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Son İşlemler</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Tümü</Text>
            </TouchableOpacity>
          </View>

          {MOCK_TRANSACTIONS.map((tx) => (
            <TouchableOpacity key={tx.id} style={styles.txRow}>
              <View style={styles.txLeft}>
                <View style={styles.txIcon}>
                  <Text style={styles.txIconText}>
                    {tx.status === 'success' ? '↗' : '✕'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.txName}>{tx.name}</Text>
                  <Text style={styles.txDate}>{tx.date}</Text>
                </View>
              </View>
              <View style={styles.txRight}>
                <Text
                  style={[
                    styles.txAmount,
                    tx.status === 'failed' && styles.txAmountFailed,
                  ]}
                >
                  ₺{tx.amount}
                </Text>
                <StatusDot status={tx.status} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: screenPaddingHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  greeting: { ...typography.bodySmall, color: colors.textSecondary },
  name: { ...typography.h3, color: colors.textPrimary },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...typography.label, color: colors.textInverse },

  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  accentBar: {
    width: 28,
    height: 3,
    backgroundColor: colors.accent,
    borderRadius: 2,
    marginBottom: spacing.md,
  },
  heroLabel: { ...typography.caption, color: colors.accent, marginBottom: spacing.xs },
  heroTitle: {
    ...typography.h2,
    color: colors.textInverse,
    marginBottom: spacing.xl,
  },
  heroBtn: { alignSelf: 'flex-start', paddingHorizontal: spacing.xl },

  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  quickItem: { alignItems: 'center', gap: spacing.xs },
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickIconText: { fontSize: 20 },
  quickLabel: { ...typography.caption, color: colors.textSecondary },

  section: { gap: spacing.xs },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: { ...typography.h3, color: colors.textPrimary },
  seeAll: { ...typography.label, color: colors.accent },

  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.xs,
  },
  txLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txIconText: { fontSize: 16 },
  txName: { ...typography.label, color: colors.textPrimary },
  txDate: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  txRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  txAmount: { ...typography.label, color: colors.textPrimary },
  txAmountFailed: { color: colors.error },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
