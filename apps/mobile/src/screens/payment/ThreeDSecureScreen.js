import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../../theme';

/**
 * 3D Secure ekranı.
 * Gerçek API geldiğinde WebView/SDK ile bağlanacak.
 * Şimdilik banka simülasyonu: 3 saniye "bağlanıyor" → mock onay.
 */
export function ThreeDSecureScreen({ route, navigation }) {
  const { amount, fee, total, recipient } = route.params;
  const [step, setStep] = useState('connecting'); // connecting | waiting | approved | failed

  useEffect(() => {
    const t1 = setTimeout(() => setStep('waiting'), 1500);
    const t2 = setTimeout(() => setStep('approved'), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (step === 'approved') {
      navigation.replace('PaymentResult', { success: true, amount, fee, total, recipient });
    }
  }, [step]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {/* Üst bölüm */}
        <View style={styles.top}>
          <View style={styles.bankIcon}>
            <Text style={styles.bankIconText}>🏦</Text>
          </View>
          <Text style={styles.title}>3D Secure Doğrulama</Text>
          <Text style={styles.subtitle}>Bankanızla güvenli bağlantı kurulıyor.</Text>
        </View>

        {/* Durum */}
        <View style={styles.statusCard}>
          {step === 'connecting' && (
            <>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={styles.statusText}>Banka sistemine bağlanılıyor...</Text>
            </>
          )}
          {step === 'waiting' && (
            <>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={styles.statusText}>Telefonunuza SMS kodu gönderildi.</Text>
              <Text style={styles.statusSub}>Bankanızın 3D Secure sayfasında doğrulama bekleniyor.</Text>
            </>
          )}
          {step === 'approved' && (
            <>
              <Text style={styles.successIcon}>✓</Text>
              <Text style={styles.statusText}>Doğrulama başarılı!</Text>
            </>
          )}
        </View>

        {/* Güvenlik notu */}
        <View style={styles.securityNote}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.securityText}>
            Bu işlem SSL ile şifrelenmiştir. Kart bilgileriniz bankanız dışında hiçbir sunucuda saklanmaz.
          </Text>
        </View>

        {/* API gelince burası gerçek WebView ile değişecek */}
        <Text style={styles.devNote}>
          Ödeme API entegrasyonu sonrası bu ekran bankanın 3DS sayfasını in-app olarak gösterecek.
        </Text>

        {/* İptal */}
        {step !== 'approved' && (
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>İşlemi İptal Et</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.xl, alignItems: 'center', justifyContent: 'center' },

  top: { alignItems: 'center', marginBottom: spacing.xxl },
  bankIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  bankIconText: { fontSize: 32 },
  title: { ...typography.h2, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },

  statusCard: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 20,
    padding: spacing.xxl,
    width: '100%',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    minHeight: 140,
    justifyContent: 'center',
  },
  statusText: { ...typography.label, color: colors.textPrimary, textAlign: 'center' },
  statusSub: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center' },
  successIcon: { fontSize: 40, color: colors.success },

  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: spacing.md,
    width: '100%',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  lockIcon: { fontSize: 16 },
  securityText: { ...typography.bodySmall, color: colors.success, flex: 1 },

  devNote: { ...typography.caption, color: colors.textTertiary, textAlign: 'center', marginBottom: spacing.xl },

  cancelBtn: { paddingVertical: spacing.sm },
  cancelText: { ...typography.label, color: colors.error },
});
