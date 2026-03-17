import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Modal, Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

const MOCK_HISTORY = [
  {
    id: 'TRP10293847', name: 'Apartman Yönetimi', iban: 'TR33 0006 1005 1978 6457 8413 26',
    amount: 2500, fee: 37.5, total: 2537.5, status: 'success',
    date: '17 Mart 2026', time: '14:32', description: 'Nisan 2026 kirası',
  },
  {
    id: 'TRP10293612', name: 'Elektrik Faturası', iban: 'TR52 0001 0017 4523 1850 3000 01',
    amount: 480, fee: 7.2, total: 487.2, status: 'success',
    date: '15 Mart 2026', time: '09:15', description: '',
  },
  {
    id: 'TRP10293401', name: 'Kira Ödemesi', iban: 'TR62 0013 4000 0147 4012 8100 09',
    amount: 12000, fee: 180, total: 12180, status: 'failed',
    date: '14 Mart 2026', time: '18:44', description: 'Mart 2026 kirası',
  },
  {
    id: 'TRP10292988', name: 'Site Yönetimi', iban: 'TR62 0013 4000 0147 4012 8100 09',
    amount: 850, fee: 12.75, total: 862.75, status: 'success',
    date: '10 Mart 2026', time: '11:02', description: 'Mart aidatı',
  },
  {
    id: 'TRP10292654', name: 'Doğalgaz', iban: 'TR33 0006 1005 1978 6457 8413 26',
    amount: 320, fee: 4.8, total: 324.8, status: 'success',
    date: '8 Mart 2026', time: '16:20', description: '',
  },
  {
    id: 'TRP10292301', name: 'İnternet Faturası', iban: 'TR52 0001 0017 4523 1850 3000 01',
    amount: 199, fee: 2.99, total: 201.99, status: 'failed',
    date: '5 Mart 2026', time: '10:55', description: '',
  },
];

const FILTERS = ['Tümü', 'Başarılı', 'Başarısız'];

const fmt = (n) => n.toFixed(2).replace('.', ',');

export function HistoryScreen() {
  const [activeFilter, setActiveFilter] = useState('Tümü');
  const [selected, setSelected] = useState(null);

  const filtered = MOCK_HISTORY.filter(tx => {
    if (activeFilter === 'Başarılı') return tx.status === 'success';
    if (activeFilter === 'Başarısız') return tx.status === 'failed';
    return true;
  });

  const handleShare = async (tx) => {
    const lines = [
      '🧾 Kiram — Ödeme Dekontu',
      '─────────────────────────',
      `Tutar:         ₺${fmt(tx.amount)}`,
      `Hizmet Bedeli: ₺${fmt(tx.fee)}`,
      `Toplam:        ₺${fmt(tx.total)}`,
      '─────────────────────────',
      `Alıcı:  ${tx.name}`,
      `IBAN:   ${tx.iban}`,
      ...(tx.description ? [`Açıklama: ${tx.description}`] : []),
      '─────────────────────────',
      `Tarih:  ${tx.date}, ${tx.time}`,
      `Ref No: ${tx.id}`,
      '',
      'kiram.com üzerinden gerçekleştirilmiştir.',
    ];
    try {
      await Share.share({ message: lines.join('\n') });
    } catch (e) {}
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Başlık */}
      <View style={styles.header}>
        <Text style={styles.title}>İşlem Geçmişi</Text>
      </View>

      {/* Filtre */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, activeFilter === f && styles.filterBtnActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.map(tx => (
          <TouchableOpacity
            key={tx.id}
            style={styles.txCard}
            onPress={() => setSelected(tx)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.txIconWrap,
              { backgroundColor: tx.status === 'success' ? '#EFF6FF' : '#FEF2F2' },
            ]}>
              <Text style={styles.txIcon}>{tx.status === 'success' ? '↗' : '✕'}</Text>
            </View>
            <View style={styles.txMid}>
              <Text style={styles.txName}>{tx.name}</Text>
              {tx.description ? (
                <Text style={styles.txDesc}>{tx.description}</Text>
              ) : null}
              <Text style={styles.txDate}>{tx.date} · {tx.time}</Text>
            </View>
            <View style={styles.txRight}>
              <Text style={[
                styles.txAmount,
                tx.status === 'failed' && { color: colors.error },
              ]}>
                ₺{fmt(tx.amount)}
              </Text>
              <View style={[styles.dot, {
                backgroundColor: tx.status === 'success' ? colors.success : colors.error,
              }]} />
            </View>
          </TouchableOpacity>
        ))}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🗂</Text>
            <Text style={styles.emptyTitle}>İşlem bulunamadı</Text>
          </View>
        )}
      </ScrollView>

      {/* Dekont modal */}
      <Modal visible={!!selected} transparent animationType="slide">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setSelected(null)}
        />
        {selected && (
          <View style={styles.detailSheet}>
            {/* Durum */}
            <View style={styles.detailTop}>
              <View style={[
                styles.statusCircle,
                { backgroundColor: selected.status === 'success' ? '#DCFCE7' : '#FEE2E2' },
              ]}>
                <Text style={styles.statusIcon}>
                  {selected.status === 'success' ? '✓' : '✕'}
                </Text>
              </View>
              <Text style={styles.detailStatus}>
                {selected.status === 'success' ? 'Ödeme Başarılı' : 'Ödeme Başarısız'}
              </Text>
              <Text style={styles.detailAmount}>₺{fmt(selected.amount)}</Text>
            </View>

            {/* Detaylar */}
            <View style={styles.detailRows}>
              {[
                { label: 'Alıcı', value: selected.name },
                { label: 'IBAN', value: selected.iban },
                ...(selected.description ? [{ label: 'Açıklama', value: selected.description }] : []),
                { label: 'Hizmet Bedeli', value: `₺${fmt(selected.fee)}` },
                { label: 'Toplam', value: `₺${fmt(selected.total)}`, bold: true },
                { label: 'Tarih', value: `${selected.date}, ${selected.time}` },
                { label: 'Referans No', value: selected.id },
              ].map(row => (
                <View key={row.label} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{row.label}</Text>
                  <Text style={[styles.detailValue, row.bold && { fontWeight: '700', color: colors.textPrimary }]}>
                    {row.value}
                  </Text>
                </View>
              ))}
            </View>

            {/* Paylaş / Kapat */}
            <View style={styles.detailActions}>
              {selected.status === 'success' && (
                <TouchableOpacity
                  style={styles.shareBtn}
                  onPress={() => handleShare(selected)}
                >
                  <Text style={styles.shareBtnIcon}>↑</Text>
                  <Text style={styles.shareBtnText}>Dekontu Paylaş</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setSelected(null)}
              >
                <Text style={styles.closeBtnText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
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

  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: screenPaddingHorizontal,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.backgroundElevated,
  },
  filterBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: { ...typography.label, color: colors.textSecondary },
  filterTextActive: { color: colors.textInverse },

  list: {
    paddingHorizontal: screenPaddingHorizontal,
    paddingBottom: 130,
    gap: spacing.xs,
  },

  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: spacing.md,
  },
  txIconWrap: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  txIcon: { fontSize: 16 },
  txMid: { flex: 1 },
  txName: { ...typography.label, color: colors.textPrimary },
  txDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },
  txDate: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  txRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  txAmount: { ...typography.label, color: colors.textPrimary },
  dot: { width: 7, height: 7, borderRadius: 4 },

  empty: { alignItems: 'center', paddingTop: spacing.xxxl, gap: spacing.md },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { ...typography.h3, color: colors.textSecondary },

  /* Dekont modal */
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  detailSheet: {
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    paddingBottom: 48,
  },
  detailTop: { alignItems: 'center', marginBottom: spacing.xl },
  statusCircle: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  statusIcon: { fontSize: 26, fontWeight: '700' },
  detailStatus: { ...typography.label, color: colors.textSecondary },
  detailAmount: { fontSize: 36, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.xs },

  detailRows: { gap: 2, marginBottom: spacing.xl },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  detailLabel: { ...typography.body, color: colors.textSecondary },
  detailValue: { ...typography.body, color: colors.textPrimary, flex: 1, textAlign: 'right', marginLeft: spacing.sm },

  detailActions: { gap: spacing.sm },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    height: 50,
  },
  shareBtnIcon: { fontSize: 16, color: colors.textPrimary },
  shareBtnText: { ...typography.label, color: colors.textPrimary },
  closeBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: { ...typography.label, color: colors.textInverse },
});
