import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

export function PaymentResultScreen({ route, navigation }) {
  const { success, failReason, amount, fee, total, recipient, description } = route.params;
  const fmt = (n) => n?.toFixed(2).replace('.', ',');
  const now = new Date();
  const dateStr = now.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const refNo = 'TRP' + Date.now().toString().slice(-8);

  const goHome = () => navigation.getParent()?.navigate('Dashboard');

  const handleShare = async () => {
    const lines = [
      '🧾 Kiram — Ödeme Dekontu',
      '─────────────────────────',
      `Tutar:        ₺${fmt(amount)}`,
      `Hizmet Bedeli: ₺${fmt(fee)}`,
      `Toplam:       ₺${fmt(total)}`,
      '─────────────────────────',
      `Alıcı:  ${recipient?.name}`,
      `IBAN:   ${recipient?.iban}`,
      ...(description ? [`Açıklama: ${description}`] : []),
      '─────────────────────────',
      `Tarih:  ${dateStr}, ${timeStr}`,
      `Ref No: ${refNo}`,
      '',
      'kiram.com üzerinden gerçekleştirilmiştir.',
    ];
    try {
      await Share.share({ message: lines.join('\n') });
    } catch (e) {
      // Kullanıcı iptal etti
    }
  };

  if (!success) {
    const isInsufficient = failReason === 'insufficient_funds';
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.center}>
          <View style={[styles.iconCircle, { backgroundColor: isInsufficient ? '#FEF9C3' : '#FEE2E2' }]}>
            <Text style={styles.iconText}>{isInsufficient ? '💳' : '✕'}</Text>
          </View>
          <Text style={styles.resultTitle}>
            {isInsufficient ? 'Bakiye Yetersiz' : 'İşlem Başarısız'}
          </Text>
          <Text style={styles.resultSub}>
            {isInsufficient
              ? 'Kartınızda yeterli bakiye bulunmuyor. Farklı bir kart deneyebilirsiniz.'
              : 'Ödeme gerçekleştirilemedi. Kart limitinizi veya bilgilerinizi kontrol edin.'}
          </Text>
          <View style={styles.actions}>
            <Button title="Farklı Kart Dene" onPress={() => navigation.goBack()} />
            <TouchableOpacity style={styles.homeBtn} onPress={goHome}>
              <Text style={styles.homeBtnText}>Ana Sayfaya Dön</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {/* Başarı ikonu */}
        <View style={styles.topSection}>
          <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
            <Text style={styles.iconText}>✓</Text>
          </View>
          <Text style={styles.resultTitle}>Ödeme Başarılı</Text>
          <Text style={styles.resultSub}>İşleminiz başarıyla tamamlandı.</Text>
        </View>

        {/* Dekont */}
        <View style={styles.receipt}>
          <Text style={styles.receiptTitle}>Dijital Dekont</Text>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Tutar</Text>
            <Text style={styles.receiptValue}>₺{fmt(amount)}</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Hizmet Bedeli</Text>
            <Text style={styles.receiptValue}>₺{fmt(fee)}</Text>
          </View>
          <View style={[styles.receiptRow, styles.totalRow]}>
            <Text style={styles.receiptLabelBold}>Toplam</Text>
            <Text style={styles.receiptValueBold}>₺{fmt(total)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Alıcı</Text>
            <Text style={styles.receiptValue}>{recipient?.name}</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>IBAN</Text>
            <Text style={[styles.receiptValue, { fontSize: 11 }]}>{recipient?.iban}</Text>
          </View>

          <View style={styles.divider} />

          {description ? (
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Açıklama</Text>
              <Text style={styles.receiptValue}>{description}</Text>
            </View>
          ) : null}
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Tarih</Text>
            <Text style={styles.receiptValue}>{dateStr}, {timeStr}</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Referans No</Text>
            <Text style={styles.receiptValue}>{refNo}</Text>
          </View>
        </View>

        {/* Aksiyonlar */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Text style={styles.shareBtnIcon}>↑</Text>
            <Text style={styles.shareBtnText}>Dekontu Paylaş</Text>
          </TouchableOpacity>
          <Button title="Ana Sayfaya Dön" onPress={goHome} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: screenPaddingHorizontal, paddingTop: spacing.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: screenPaddingHorizontal },

  topSection: { alignItems: 'center', marginBottom: spacing.xl },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  iconText: { fontSize: 32, fontWeight: '700', color: colors.textPrimary },
  resultTitle: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.xs },
  resultSub: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },

  receipt: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 20,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  receiptTitle: { ...typography.label, color: colors.textTertiary, marginBottom: spacing.md, textAlign: 'center' },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  totalRow: { paddingTop: spacing.sm },
  receiptLabel: { ...typography.body, color: colors.textSecondary },
  receiptValue: { ...typography.body, color: colors.textPrimary, textAlign: 'right', flex: 1, marginLeft: spacing.sm },
  receiptLabelBold: { ...typography.label, color: colors.textPrimary },
  receiptValueBold: { ...typography.label, color: colors.primary, fontSize: 18 },
  divider: { height: 1, backgroundColor: colors.borderLight, marginVertical: spacing.sm },

  actions: { gap: spacing.sm },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    height: 52,
    marginBottom: spacing.xs,
  },
  shareBtnIcon: { fontSize: 18, color: colors.textPrimary },
  shareBtnText: { ...typography.label, color: colors.textPrimary },

  homeBtn: { alignItems: 'center', paddingVertical: spacing.sm },
  homeBtnText: { ...typography.label, color: colors.textSecondary },
});
