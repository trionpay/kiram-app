import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { TrionPayLogo } from '../../components/TrionPayLogo';
import { TransactionDetailModal } from '../../components/TransactionDetailModal';
import { SkeletonTransactionRow } from '../../components/Skeleton';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

const MOCK_TXS = [
  { id: 'TRP10293847', name: 'Apartman Yönetimi', iban: 'TR33 0006 1005 1978 6457 8413 26', amount: 2500, fee: 37.5, total: 2537.5, status: 'success', date: '17 Mart 2026', time: '10:32', description: 'Nisan 2026 kirası' },
  { id: 'TRP10293612', name: 'Elektrik Faturası', iban: 'TR52 0001 0017 4523 1850 3000 01', amount: 480, fee: 7.2, total: 487.2, status: 'success', date: 'Dün', time: '14:15', description: '' },
  { id: 'TRP10293401', name: 'Kira Ödemesi', iban: 'TR62 0013 4000 0147 4012 8100 09', amount: 12000, fee: 180, total: 12180, status: 'failed', date: '15 Mar', time: '', description: 'Mart 2026 kirası' },
];

const RECENT_RECIPIENTS = [
  { id: '1', nickname: 'Apartman', initial: 'A', emoji: '🏢', color: '#5B7FA6' },
  { id: '2', nickname: 'Ev Sahibi', initial: 'E', emoji: '🏠', color: '#4A9B7F' },
  { id: '3', nickname: 'Site', initial: 'S', emoji: '🏡', color: '#B56B6B' },
  { id: '4', nickname: 'Elektrik', initial: 'E', emoji: '⚡', color: '#B8894A' },
];


const fmt = (n) => (n || 0).toFixed(2).replace('.', ',');

export function DashboardScreen({ navigation }) {
  const [selectedTx, setSelectedTx] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

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
        <LinearGradient
          colors={['#102A43', '#0C1929', '#061018']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroDecorCircle} />
          <View style={styles.heroDecorCircle2} />
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
        </LinearGradient>

        {/* Son Alıcılar */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Son Alıcılar</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Recipients')}>
            <Text style={styles.seeAll}>Tümü</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recipientsRow}
          style={styles.recipientsScroll}
        >
          {RECENT_RECIPIENTS.map((r) => (
            <TouchableOpacity
              key={r.id}
              style={styles.recipientItem}
              onPress={() => navigation.navigate('Payment')}
              activeOpacity={0.75}
            >
              <View style={[styles.recipientAvatar, { backgroundColor: r.color }]}>
                <Text style={styles.recipientInitial}>{r.initial}</Text>
                <View style={styles.recipientBadge}>
                  <Text style={styles.recipientBadgeEmoji}>{r.emoji}</Text>
                </View>
              </View>
              <Text style={styles.recipientLabel} numberOfLines={1}>{r.nickname}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Son işlemler */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Son İşlemler</Text>
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <Text style={styles.seeAll}>Tümü</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <>
            <SkeletonTransactionRow />
            <SkeletonTransactionRow />
            <SkeletonTransactionRow />
          </>
        ) : (
          MOCK_TXS.map((tx) => (
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
          ))
        )}

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
    borderRadius: 20,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    marginBottom: spacing.xl,
    gap: spacing.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  heroDecorCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(3, 105, 161, 0.12)',
    top: -60,
    right: -40,
  },
  heroDecorCircle2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    bottom: -30,
    left: -20,
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

  /* Son Alıcılar */
  recipientsScroll: {
    marginHorizontal: -screenPaddingHorizontal,
    marginBottom: spacing.xxl,
  },
  recipientsRow: {
    paddingHorizontal: screenPaddingHorizontal,
    gap: spacing.md,
  },
  recipientItem: {
    alignItems: 'center',
    gap: 6,
    width: 64,
  },
  recipientAvatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipientInitial: {
    ...typography.h3,
    color: colors.textInverse,
  },
  recipientBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  recipientBadgeEmoji: {
    fontSize: 11,
  },
  recipientLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    width: '100%',
  },

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
