import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

const MOCK_TXS = [
  { id: '1', name: 'Apartman Yönetimi', amount: '2.500,00', status: 'success', date: 'Bugün, 10:32' },
  { id: '2', name: 'Elektrik Faturası', amount: '480,00', status: 'success', date: 'Dün, 14:15' },
  { id: '3', name: 'Kira Ödemesi', amount: '12.000,00', status: 'failed', date: '15 Mar' },
];

const QUICK_ACTIONS = [
  { icon: '↗', label: 'Gönder', screen: 'Payment' },
  { icon: '◎', label: 'Alıcılar', screen: 'Recipients' },
  { icon: '↻', label: 'Geçmiş', screen: 'History' },
  { icon: '⚡', label: 'Fatura', screen: 'Payment' },
];

export function DashboardScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Üst başlık */}
        <View style={styles.topRow}>
          <View>
            <Text style={styles.greeting}>Merhaba 👋</Text>
            <Text style={styles.name}>Kullanıcı</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarTxt}>K</Text>
          </View>
        </View>

        {/* Ana CTA */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => navigation.navigate('Payment')}
          activeOpacity={0.88}
        >
          <Text style={styles.ctaIcon}>↗</Text>
          <Text style={styles.ctaText}>Ödeme Başlat</Text>
        </TouchableOpacity>

        {/* Hızlı aksiyonlar */}
        <View style={styles.quickRow}>
          {QUICK_ACTIONS.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.quickItem}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.7}
            >
              <View style={styles.quickIcon}>
                <Text style={styles.quickIconText}>{item.icon}</Text>
              </View>
              <Text style={styles.quickLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Son işlemler */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Son İşlemler</Text>
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <Text style={styles.seeAll}>Tümü</Text>
          </TouchableOpacity>
        </View>

        {MOCK_TXS.map((tx) => (
          <TouchableOpacity key={tx.id} style={styles.txRow} activeOpacity={0.7}>
            <View style={[styles.txIconWrap, { backgroundColor: tx.status === 'success' ? '#EFF6FF' : '#FEF2F2' }]}>
              <Text style={styles.txIconText}>
                {tx.status === 'success' ? '↗' : '✕'}
              </Text>
            </View>
            <View style={styles.txMid}>
              <Text style={styles.txName}>{tx.name}</Text>
              <Text style={styles.txDate}>{tx.date}</Text>
            </View>
            <View style={styles.txRight}>
              <Text style={[styles.txAmount, tx.status === 'failed' && { color: colors.error }]}>
                ₺{tx.amount}
              </Text>
              <View style={[styles.dot, { backgroundColor: tx.status === 'success' ? colors.success : colors.error }]} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: screenPaddingHorizontal,
    paddingTop: spacing.md,
    paddingBottom: 130,
  },

  /* Üst */
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  greeting: { ...typography.bodySmall, color: colors.textSecondary },
  name: { ...typography.h2, color: colors.textPrimary, marginTop: 2 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTxt: { ...typography.label, color: colors.textInverse },

  /* Ana CTA butonu */
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: 16,
    height: 56,
    marginBottom: spacing.xl,
    gap: spacing.sm,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaIcon: { fontSize: 20, color: colors.textInverse },
  ctaText: { ...typography.label, fontSize: 17, color: colors.textInverse },

  /* Hızlı aksiyonlar */
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xxl,
  },
  quickItem: { alignItems: 'center', gap: 6 },
  quickIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickIconText: { fontSize: 22 },
  quickLabel: { ...typography.caption, color: colors.textSecondary },

  /* Son işlemler */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: { ...typography.h3, color: colors.textPrimary },
  seeAll: { ...typography.label, color: colors.accent },

  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: spacing.md,
  },
  txIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txIconText: { fontSize: 16 },
  txMid: { flex: 1 },
  txName: { ...typography.label, color: colors.textPrimary },
  txDate: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  txRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  txAmount: { ...typography.label, color: colors.textPrimary },
  dot: { width: 7, height: 7, borderRadius: 4 },
});
