import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransactionDetailModal } from '../../components/TransactionDetailModal';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

export const MOCK_HISTORY = [
  {
    id: 'TRP10293847', name: 'Apartman Yönetimi', iban: 'TR33 0006 1005 1978 6457 8413 26',
    amount: 2500, fee: 37.5, total: 2537.5, status: 'success',
    date: '17 Mart 2026', time: '14:32', description: 'Nisan 2026 kirası',
    month: 3,
  },
  {
    id: 'TRP10293612', name: 'Elektrik Faturası', iban: 'TR52 0001 0017 4523 1850 3000 01',
    amount: 480, fee: 7.2, total: 487.2, status: 'success',
    date: '15 Mart 2026', time: '09:15', description: '',
    month: 3,
  },
  {
    id: 'TRP10293401', name: 'Kira Ödemesi', iban: 'TR62 0013 4000 0147 4012 8100 09',
    amount: 12000, fee: 180, total: 12180, status: 'failed',
    date: '14 Mart 2026', time: '18:44', description: 'Mart 2026 kirası',
    month: 3,
  },
  {
    id: 'TRP10292988', name: 'Site Yönetimi', iban: 'TR62 0013 4000 0147 4012 8100 09',
    amount: 850, fee: 12.75, total: 862.75, status: 'success',
    date: '10 Mart 2026', time: '11:02', description: 'Mart aidatı',
    month: 3,
  },
  {
    id: 'TRP10292654', name: 'Doğalgaz', iban: 'TR33 0006 1005 1978 6457 8413 26',
    amount: 320, fee: 4.8, total: 324.8, status: 'success',
    date: '8 Mart 2026', time: '16:20', description: '',
    month: 3,
  },
  {
    id: 'TRP10292301', name: 'İnternet Faturası', iban: 'TR52 0001 0017 4523 1850 3000 01',
    amount: 199, fee: 2.99, total: 201.99, status: 'failed',
    date: '5 Mart 2026', time: '10:55', description: '',
    month: 3,
  },
  {
    id: 'TRP10291855', name: 'Apartman Yönetimi', iban: 'TR33 0006 1005 1978 6457 8413 26',
    amount: 2500, fee: 37.5, total: 2537.5, status: 'success',
    date: '17 Şubat 2026', time: '13:10', description: 'Mart 2026 kirası',
    month: 2,
  },
  {
    id: 'TRP10291422', name: 'Su Faturası', iban: 'TR52 0001 0017 4523 1850 3000 01',
    amount: 145, fee: 2.18, total: 147.18, status: 'success',
    date: '12 Şubat 2026', time: '08:40', description: '',
    month: 2,
  },
];

const STATUS_FILTERS = ['Tümü', 'Başarılı', 'Başarısız'];
const DATE_FILTERS = ['Tümü', 'Bu Ay', 'Geçen Ay'];

const fmt = (n) => (n || 0).toFixed(2).replace('.', ',');

function SummaryBar({ transactions }) {
  const success = transactions.filter(t => t.status === 'success');
  const total = success.reduce((s, t) => s + t.total, 0);
  return (
    <View style={styles.summaryBar}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryValue}>{transactions.length}</Text>
        <Text style={styles.summaryLabel}>İşlem</Text>
      </View>
      <View style={styles.summaryDivider} />
      <View style={styles.summaryItem}>
        <Text style={styles.summaryValue}>{success.length}</Text>
        <Text style={styles.summaryLabel}>Başarılı</Text>
      </View>
      <View style={styles.summaryDivider} />
      <View style={styles.summaryItem}>
        <Text style={[styles.summaryValue, { color: colors.accent }]}>₺{fmt(total)}</Text>
        <Text style={styles.summaryLabel}>Toplam</Text>
      </View>
    </View>
  );
}

export function HistoryScreen() {
  const [statusFilter, setStatusFilter] = useState('Tümü');
  const [dateFilter, setDateFilter] = useState('Tümü');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return MOCK_HISTORY.filter(tx => {
      const statusOk =
        statusFilter === 'Tümü' ||
        (statusFilter === 'Başarılı' && tx.status === 'success') ||
        (statusFilter === 'Başarısız' && tx.status === 'failed');
      const dateOk =
        dateFilter === 'Tümü' ||
        (dateFilter === 'Bu Ay' && tx.month === 3) ||
        (dateFilter === 'Geçen Ay' && tx.month === 2);
      return statusOk && dateOk;
    });
  }, [statusFilter, dateFilter]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>İşlem Geçmişi</Text>
      </View>

      {/* Tarih filtresi */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateFilterRow}
      >
        {DATE_FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.dateChip, dateFilter === f && styles.dateChipActive]}
            onPress={() => setDateFilter(f)}
          >
            <Text style={[styles.dateChipText, dateFilter === f && styles.dateChipTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Durum filtresi */}
      <View style={styles.statusFilterRow}>
        {STATUS_FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.statusBtn, statusFilter === f && styles.statusBtnActive]}
            onPress={() => setStatusFilter(f)}
          >
            <Text style={[styles.statusBtnText, statusFilter === f && styles.statusBtnTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Özet bar */}
      <SummaryBar transactions={filtered} />

      {/* Liste */}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🗂</Text>
            <Text style={styles.emptyTitle}>İşlem bulunamadı</Text>
            <Text style={styles.emptySub}>Farklı bir filtre deneyin.</Text>
          </View>
        )}

        {filtered.map(tx => (
          <TouchableOpacity
            key={tx.id}
            style={styles.txRow}
            onPress={() => setSelected(tx)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.txIcon,
              { backgroundColor: tx.status === 'success' ? '#EFF6FF' : '#FEF2F2' },
            ]}>
              <Text style={styles.txIconText}>{tx.status === 'success' ? '↗' : '✕'}</Text>
            </View>

            <View style={styles.txMid}>
              <Text style={styles.txName}>{tx.name}</Text>
              {tx.description ? <Text style={styles.txDesc}>{tx.description}</Text> : null}
              <Text style={styles.txDate}>{tx.date} · {tx.time}</Text>
            </View>

            <View style={styles.txRight}>
              <Text style={[
                styles.txAmount,
                tx.status === 'failed' && { color: colors.error },
              ]}>
                ₺{fmt(tx.amount)}
              </Text>
              <Text style={styles.txChevron}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TransactionDetailModal
        transaction={selected}
        onClose={() => setSelected(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: {
    paddingHorizontal: screenPaddingHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: { ...typography.h1, color: colors.textPrimary },

  dateFilterRow: {
    paddingHorizontal: screenPaddingHorizontal,
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  dateChip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  dateChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dateChipText: { ...typography.label, color: colors.textSecondary },
  dateChipTextActive: { color: colors.textInverse },

  statusFilterRow: {
    flexDirection: 'row',
    paddingHorizontal: screenPaddingHorizontal,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  statusBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundElevated,
  },
  statusBtnActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  statusBtnText: { ...typography.label, color: colors.textSecondary },
  statusBtnTextActive: { color: colors.textInverse },

  summaryBar: {
    flexDirection: 'row',
    marginHorizontal: screenPaddingHorizontal,
    backgroundColor: colors.backgroundElevated,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { ...typography.h3, color: colors.textPrimary },
  summaryLabel: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  summaryDivider: { width: 1, backgroundColor: colors.borderLight },

  list: {
    paddingHorizontal: screenPaddingHorizontal,
    paddingBottom: 130,
  },

  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: spacing.md,
  },
  txIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  txIconText: { fontSize: 16 },
  txMid: { flex: 1 },
  txName: { ...typography.label, color: colors.textPrimary },
  txDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },
  txDate: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  txRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  txAmount: { ...typography.label, color: colors.textPrimary },
  txChevron: { fontSize: 18, color: colors.textTertiary },

  empty: { alignItems: 'center', paddingTop: spacing.xxxl, gap: spacing.sm },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { ...typography.h3, color: colors.textSecondary },
  emptySub: { ...typography.body, color: colors.textTertiary },
});
