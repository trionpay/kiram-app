import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

const Row = ({ label, value, highlight }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={[styles.rowValue, highlight && { color: colors.accent, fontWeight: '700' }]}>{value}</Text>
  </View>
);

export function PaymentSummaryScreen({ route, navigation }) {
  const { amount, fee, total, recipient } = route.params;

  const fmt = (n) => n.toFixed(2).replace('.', ',');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {/* Geri */}
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>İşlem Özeti</Text>
        <Text style={styles.subtitle}>Lütfen bilgileri kontrol edin.</Text>

        {/* Özet kart */}
        <View style={styles.card}>
          <View style={styles.amountBlock}>
            <Text style={styles.amountLabel}>Gönderilecek Tutar</Text>
            <Text style={styles.amount}>₺{fmt(amount)}</Text>
          </View>

          <View style={styles.divider} />

          <Row label="Alıcı" value={recipient.name} />
          <Row label="IBAN" value={recipient.iban} />
          <View style={styles.divider} />
          <Row label="Hizmet Bedeli (%1,5)" value={`₺${fmt(fee)}`} />
          <Row label="Toplam Çekilecek" value={`₺${fmt(total)}`} highlight />
        </View>

        {/* Uyarı */}
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            Ödeme onaylandıktan sonra işlem geri alınamaz. Alıcı bilgilerini lütfen kontrol edin.
          </Text>
        </View>

        <View style={styles.footer}>
          <Button
            title="Ödemeye Devam"
            onPress={() => navigation.navigate('CardInput', { amount, fee, total, recipient })}
          />
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Vazgeç</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: screenPaddingHorizontal, paddingTop: spacing.sm },
  back: { alignSelf: 'flex-start', marginBottom: spacing.xl },
  backArrow: { fontSize: 24, color: colors.textPrimary },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },

  card: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 20,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  amountBlock: { alignItems: 'center', paddingBottom: spacing.xl },
  amountLabel: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.xs },
  amount: { fontSize: 42, fontWeight: '700', color: colors.textPrimary, letterSpacing: -1 },

  divider: { height: 1, backgroundColor: colors.borderLight, marginVertical: spacing.md },

  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.xs },
  rowLabel: { ...typography.body, color: colors.textSecondary },
  rowValue: { ...typography.label, color: colors.textPrimary, flex: 1, textAlign: 'right' },

  notice: {
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  noticeText: { ...typography.bodySmall, color: colors.warning },

  footer: { position: 'absolute', bottom: 0, left: screenPaddingHorizontal, right: screenPaddingHorizontal, paddingBottom: 40, gap: spacing.sm },
  cancelBtn: { alignItems: 'center', paddingVertical: spacing.sm },
  cancelText: { ...typography.label, color: colors.textSecondary },
});
