import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TrionPayLogo } from '../../components/TrionPayLogo';
import { TransactionDetailModal } from '../../components/TransactionDetailModal';
import { SkeletonTransactionRow } from '../../components/Skeleton';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

const PROFILE_FIRST_NAME_KEY = 'kiram_profile_first_name_v1';

const MOCK_TXS = [
  { id: 'TRP10293847', name: 'Apartman Yönetimi', iban: 'TR33 0006 1005 1978 6457 8413 26', amount: 2500, fee: 37.5, total: 2537.5, status: 'success', createdAt: '2026-03-17T10:32:00', date: '17 Mar 2026', time: '10:32', description: 'Nisan 2026 kirası' },
  { id: 'TRP10293612', name: 'Apartman Aidatı', iban: 'TR52 0001 0017 4523 1850 3000 01', amount: 850, fee: 12.75, total: 862.75, status: 'success', createdAt: '2026-03-16T14:15:00', date: '16 Mar 2026', time: '14:15', description: '' },
  { id: 'TRP10293401', name: 'Kira Ödemesi', iban: 'TR62 0013 4000 0147 4012 8100 09', amount: 12000, fee: 180, total: 12180, status: 'failed', createdAt: '2026-03-15T11:05:00', date: '15 Mar 2026', time: '', description: 'Mart 2026 kirası' },
];

const RECENT_RECIPIENTS = [
  { id: '1', nickname: 'Apartman', name: 'Apartman Yönetimi', iban: 'TR33 0006 1005 1978 6457 8413 26', initial: 'A', emoji: '🏢', color: '#5B7FA6' },
  { id: '2', nickname: 'Ev Sahibi', name: 'Ev Sahibi', iban: 'TR52 0001 0017 4523 1850 3000 01', initial: 'E', emoji: '🏠', color: '#4A9B7F' },
  { id: '3', nickname: 'Site', name: 'Site Yönetimi', iban: 'TR62 0013 4000 0147 4012 8100 09', initial: 'S', emoji: '🏡', color: '#B56B6B' },
  { id: '4', nickname: 'Aidat', name: 'Site Aidatı', iban: 'TR11 0001 0011 8250 3000 2100 09', initial: 'A', emoji: '🏢', color: '#B8894A' },
];

const formatMoneyTr = (value) => {
  const formatted = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
  return formatted.endsWith(',00') ? formatted.slice(0, -3) : formatted;
};

const formatDateTr = (isoDate) => new Intl.DateTimeFormat('tr-TR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
}).format(new Date(isoDate));

export function DashboardScreen({ navigation, route }) {
  const [selectedTx, setSelectedTx] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileName, setProfileName] = useState('Deniz');
  const transactions = MOCK_TXS;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const readProfile = async () => {
      if (route?.params?.firstName?.trim()) {
        setProfileName(route.params.firstName.trim());
      }
      const storedName = await AsyncStorage.getItem(PROFILE_FIRST_NAME_KEY);
      if (storedName?.trim()) {
        setProfileName(storedName.trim());
      }
    };
    readProfile();
  }, [route?.params?.firstName]);

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
            <Text style={styles.name}>{profileName}</Text>
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
              <Text style={styles.heroTitle}>Kira ve aidat</Text>
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
              onPress={() => navigation.navigate('Payment', {
                screen: 'PaymentAmount',
                params: {
                  origin: 'Dashboard',
                  preselectedRecipient: { id: r.id, name: r.name, iban: r.iban, nickname: r.nickname },
                },
              })}
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
        ) : transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Henüz işlem bulunmuyor</Text>
            <Text style={styles.emptyStateText}>
              İlk ödeme işleminiz burada listelenecek. Hemen yeni bir ödeme başlatabilirsiniz.
            </Text>
            <TouchableOpacity style={styles.emptyStateButton} onPress={() => navigation.navigate('Payment')}>
              <Text style={styles.emptyStateButtonText}>Ödeme Başlat</Text>
            </TouchableOpacity>
          </View>
        ) : (
          transactions.map((tx) => (
            <TouchableOpacity
              key={tx.id}
              style={styles.txRow}
              activeOpacity={0.7}
              onPress={() => setSelectedTx({ ...tx, date: formatDateTr(tx.createdAt) })}
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
                <Text style={styles.txDate}>{formatDateTr(tx.createdAt)}</Text>
              </View>
              <View style={styles.txRight}>
                <Text style={[styles.txAmount, tx.status === 'failed' && { color: colors.error }]}>
                  ₺{formatMoneyTr(tx.amount)}
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
  emptyState: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundElevated,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  emptyStateTitle: { ...typography.h3, color: colors.textPrimary },
  emptyStateText: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 20 },
  emptyStateButton: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  emptyStateButtonText: { ...typography.label, color: colors.textInverse },
});
