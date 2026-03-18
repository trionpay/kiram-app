import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

const PURPOSE_LABELS = {
  rent: '🏠 Kira Ödemesi',
  dues: '🏢 Aidat Ödemesi',
  bills: '⚡ Fatura Ödemesi',
  all: '✨ Hepsi',
};

export function KYCSummaryScreen({ navigation, route }) {
  const { firstName, lastName, city, tckn, birthDate, purposes } = route.params;
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const maskedTckn = tckn.slice(0, 3) + '*'.repeat(5) + tckn.slice(8);

  const handleConfirm = () => {
    setLoading(true);
    // Mock: API bağlandığında KYC verisi gönderilecek, hesap aktifleştirilecek
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Main');
    }, 1500);
  };

  const rows = [
    { label: 'Ad Soyad', value: `${firstName} ${lastName}` },
    { label: 'Şehir', value: city },
    { label: 'T.C. Kimlik No', value: maskedTckn },
    { label: 'Doğum Tarihi', value: birthDate },
    { label: 'Kullanım Amacı', value: purposes.map(p => PURPOSE_LABELS[p]).join(', ') },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* İlerleme */}
        <View style={styles.progressRow}>
          {[1, 2, 3, 4].map(i => (
            <View key={i} style={[styles.progressBar, styles.progressBarActive]} />
          ))}
        </View>
        <Text style={styles.stepLabel}>Adım 4 / 4</Text>

        <Text style={styles.title}>Bilgilerinizi{'\n'}onaylayın</Text>
        <Text style={styles.subtitle}>
          Onayladıktan sonra T.C. Kimlik Numarası ve Ad Soyad bilgileri değiştirilemez.
        </Text>

        {/* Özet kart */}
        <View style={styles.card}>
          {rows.map((row, i) => (
            <View key={row.label} style={[styles.row, i < rows.length - 1 && styles.rowBorder]}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* Sözleşme onayı */}
        <TouchableOpacity style={styles.agreeRow} onPress={() => setAgreed(!agreed)}>
          <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
            {agreed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.agreeText}>
            <Text style={styles.agreeLink}>Kullanıcı Sözleşmesi</Text>
            {', '}
            <Text style={styles.agreeLink}>KVKK Aydınlatma Metni</Text>
            {' ve '}
            <Text style={styles.agreeLink}>Gizlilik Politikası</Text>
            {"'nı okudum, kabul ediyorum."}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.accent} />
            <Text style={styles.loadingText}>Hesabınız oluşturuluyor...</Text>
          </View>
        ) : (
          <Button title="Hesabımı Onayla" onPress={handleConfirm} disabled={!agreed} />
        )}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Geri</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: screenPaddingHorizontal, paddingTop: spacing.lg, paddingBottom: spacing.xl },

  progressRow: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.xs },
  progressBar: { flex: 1, height: 3, borderRadius: 2, backgroundColor: colors.border },
  progressBarActive: { backgroundColor: colors.accent },
  stepLabel: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.xl },

  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl, lineHeight: 22 },

  card: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  row: { padding: spacing.md },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  rowLabel: { ...typography.caption, color: colors.textTertiary, marginBottom: 4 },
  rowValue: { ...typography.label, color: colors.textPrimary },

  agreeRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
  },
  checkboxActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  checkmark: { color: colors.textInverse, fontSize: 12, fontWeight: '700' },
  agreeText: { ...typography.bodySmall, color: colors.textSecondary, flex: 1, lineHeight: 20 },
  agreeLink: { color: colors.accent, fontFamily: 'DMSans_600SemiBold' },

  footer: { paddingHorizontal: screenPaddingHorizontal, paddingBottom: spacing.md, paddingTop: spacing.sm, gap: spacing.sm },
  loadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, height: 52 },
  loadingText: { ...typography.body, color: colors.textSecondary },
  backBtn: { alignItems: 'center', paddingVertical: spacing.sm },
  backText: { ...typography.label, color: colors.textSecondary },
});
