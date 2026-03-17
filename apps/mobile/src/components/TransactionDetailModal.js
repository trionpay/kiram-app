import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Share, ScrollView } from 'react-native';
import { colors, typography, spacing, screenPaddingHorizontal } from '../theme';

const fmt = (n) => (n || 0).toFixed(2).replace('.', ',');

export function TransactionDetailModal({ transaction, onClose }) {
  if (!transaction) return null;
  const tx = transaction;
  const isSuccess = tx.status === 'success';

  const handleShare = async () => {
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
      `Tarih:  ${tx.date}${tx.time ? ', ' + tx.time : ''}`,
      `Ref No: ${tx.id}`,
      '',
      'kiram.com üzerinden gerçekleştirilmiştir.',
    ];
    try {
      await Share.share({ message: lines.join('\n') });
    } catch (e) {}
  };

  const rows = [
    { label: 'Alıcı', value: tx.name },
    { label: 'IBAN', value: tx.iban, small: true },
    ...(tx.description ? [{ label: 'Açıklama', value: tx.description }] : []),
    { label: 'Hizmet Bedeli', value: `₺${fmt(tx.fee)}` },
    { label: 'Toplam', value: `₺${fmt(tx.total)}`, bold: true },
    { label: 'Tarih', value: `${tx.date}${tx.time ? ', ' + tx.time : ''}` },
    { label: 'Referans No', value: tx.id, small: true },
  ];

  return (
    <Modal visible={!!transaction} transparent animationType="slide">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={styles.sheet}>
        {/* Tutamaç */}
        <View style={styles.handle} />

        {/* Durum */}
        <View style={styles.topSection}>
          <View style={[styles.statusCircle, { backgroundColor: isSuccess ? '#DCFCE7' : '#FEE2E2' }]}>
            <Text style={[styles.statusIcon, { color: isSuccess ? colors.success : colors.error }]}>
              {isSuccess ? '✓' : '✕'}
            </Text>
          </View>
          <Text style={[styles.statusLabel, { color: isSuccess ? colors.success : colors.error }]}>
            {isSuccess ? 'Ödeme Başarılı' : 'Ödeme Başarısız'}
          </Text>
          <Text style={styles.amount}>₺{fmt(tx.amount)}</Text>
        </View>

        {/* Detay satırları */}
        <ScrollView style={styles.rowsScroll} showsVerticalScrollIndicator={false}>
          {rows.map(row => (
            <View key={row.label} style={styles.row}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={[
                styles.rowValue,
                row.bold && styles.rowValueBold,
                row.small && styles.rowValueSmall,
              ]}>
                {row.value}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Aksiyonlar */}
        <View style={styles.actions}>
          {isSuccess && (
            <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
              <Text style={styles.shareBtnIcon}>↑</Text>
              <Text style={styles.shareBtnText}>Dekontu Paylaş</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: screenPaddingHorizontal,
    paddingBottom: 44,
    maxHeight: '85%',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  topSection: { alignItems: 'center', marginBottom: spacing.xl },
  statusCircle: {
    width: 64, height: 64, borderRadius: 32,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statusIcon: { fontSize: 28, fontWeight: '700' },
  statusLabel: { ...typography.label, marginBottom: spacing.xs },
  amount: { fontSize: 38, fontWeight: '700', color: colors.textPrimary, letterSpacing: -1 },

  rowsScroll: { maxHeight: 280 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: spacing.md,
  },
  rowLabel: { ...typography.body, color: colors.textSecondary, flexShrink: 0 },
  rowValue: { ...typography.body, color: colors.textPrimary, flex: 1, textAlign: 'right' },
  rowValueBold: { fontWeight: '700', color: colors.primary },
  rowValueSmall: { fontSize: 12, letterSpacing: 0.5 },

  actions: { marginTop: spacing.xl, gap: spacing.sm },
  shareBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: 14, height: 50,
  },
  shareBtnIcon: { fontSize: 16, color: colors.textPrimary },
  shareBtnText: { ...typography.label, color: colors.textPrimary },
  closeBtn: {
    backgroundColor: colors.primary, borderRadius: 14,
    height: 50, alignItems: 'center', justifyContent: 'center',
  },
  closeBtnText: { ...typography.label, color: colors.textInverse },
});
