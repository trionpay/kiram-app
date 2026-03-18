import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrionPayLogo } from '../../components/TrionPayLogo';
import { TransactionDetailModal } from '../../components/TransactionDetailModal';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

const MOCK_TXS = [
  { id: 'TRP10293847', name: 'Apartman Yönetimi', iban: 'TR33 0006 1005 1978 6457 8413 26', amount: 2500, fee: 37.5, total: 2537.5, status: 'success', date: '17 Mart 2026', time: '10:32', description: 'Nisan 2026 kirası' },
  { id: 'TRP10293612', name: 'Elektrik Faturası', iban: 'TR52 0001 0017 4523 1850 3000 01', amount: 480, fee: 7.2, total: 487.2, status: 'success', date: 'Dün', time: '14:15', description: '' },
  { id: 'TRP10293401', name: 'Kira Ödemesi', iban: 'TR62 0013 4000 0147 4012 8100 09', amount: 12000, fee: 180, total: 12180, status: 'failed', date: '15 Mar', time: '', description: 'Mart 2026 kirası' },
];

const QUICK_ACTIONS = [
  { icon: '↗', label: 'Gönder', screen: 'Payment' },
  { icon: '📋', label: 'Alıcılar', screen: 'Recipients' },
  { icon: '🗂', label: 'Geçmiş', screen: 'History' },
  { icon: '⚡', label: 'Fatura', screen: 'Payment' },
];

const fmt = (n) => (n || 0).toFixed(2).replace('.', ',');

export function DashboardScreen({ navigation }) {
  const [selectedTx, setSelectedTx] = useState(null);

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
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}
          >
            <Text style={styles.avatarTxt}>K</Text>
          </TouchableOpacity>
        </View>

        {/* Hero kart */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroTitle}>Kira, aidat, fatura</Text>
              <Text style={styles.heroTitle}>tek yerden öde.</Text>
            </View>
            <TrionPayLogo width={65} color="#FFFFFF" accentColor="#5FE00B" />
          </View>
          <TouchableOpacity
            style={styles.heroBtn}
            onPress={() => navigation.navigate('Payment')}
            activeOpacity={0.88}
          >
            <Text style={styles.heroBtnText}>Ödeme Başlat</Text>
            <Text style={styles.heroBtnIcon}>→</Text>
          </TouchableOpacity>
        </View>

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
          <TouchableOpacity
            key={tx.id}
            style={styles.txRow}
            activeOpacity={0.7}
            onPress={() => setSelectedTx(tx)}
          >
            <View style={[
              styles.txIconWrap,
              { backgroundColor: tx.status === 'success' ? '#EFF6FF' : '#FEF2F2' },
            ]}>
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
                ₺{fmt(tx.amount)}
              </Text>
              <Text style={{ fontSize: 16, color: colors.textTertiary }}>›</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TransactionDetailModal
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
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

  /* Hero kart */
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    marginBottom: spacing.xl,
    gap: spacing.lg,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroTitle: {
    ...typography.h2,
    color: colors.textInverse,
    lineHeight: 28,
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  heroBtnText: {
    ...typography.label,
    fontSize: 16,
    color: colors.textInverse,
  },
  heroBtnIcon: {
    fontSize: 18,
    color: colors.textInverse,
    fontWeight: '600',
  },

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
  quickIconText: { fontSize: 20 },
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
