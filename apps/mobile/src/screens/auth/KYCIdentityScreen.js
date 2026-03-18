import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

function validateTCKN(tckn) {
  if (tckn.length !== 11) return false;
  if (tckn[0] === '0') return false;
  const digits = tckn.split('').map(Number);
  const sum10 = (digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7
    - (digits[1] + digits[3] + digits[5] + digits[7]);
  if ((sum10 % 10) !== digits[9]) return false;
  const sum11 = digits.slice(0, 10).reduce((a, b) => a + b, 0);
  return (sum11 % 10) === digits[10];
}

function formatBirthDate(text, prev) {
  const digits = text.replace(/\D/g, '');
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
}

export function KYCIdentityScreen({ navigation, route }) {
  const { firstName, lastName, city } = route.params;
  const [tckn, setTckn] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const tcknValid = validateTCKN(tckn);
  const birthValid = birthDate.length === 10;
  const isValid = tcknValid && birthValid;

  const handleNext = () => {
    navigation.navigate('KYCPurpose', { firstName, lastName, city, tckn, birthDate });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* İlerleme */}
          <View style={styles.progressRow}>
            {[1, 2, 3, 4].map(i => (
              <View key={i} style={[styles.progressBar, i <= 2 && styles.progressBarActive]} />
            ))}
          </View>
          <Text style={styles.stepLabel}>Adım 2 / 4</Text>

          <Text style={styles.title}>Kimlik bilgileri</Text>
          <Text style={styles.subtitle}>
            Bu bilgiler hesabınızı doğrulamak için kullanılır ve değiştirilemez.
          </Text>

          {/* TCKN */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>T.C. Kimlik Numarası</Text>
            <TextInput
              style={[styles.input, tckn.length === 11 && (tcknValid ? styles.inputValid : styles.inputError)]}
              value={tckn}
              onChangeText={t => setTckn(t.replace(/\D/g, '').slice(0, 11))}
              placeholder="00000000000"
              placeholderTextColor={colors.textTertiary}
              keyboardType="number-pad"
              maxLength={11}
              secureTextEntry
              autoFocus
            />
            {tckn.length === 11 && !tcknValid && (
              <Text style={styles.errorText}>Geçersiz T.C. Kimlik Numarası</Text>
            )}
            {tcknValid && (
              <Text style={styles.successText}>✓ Kimlik numarası doğrulandı</Text>
            )}
          </View>

          {/* Doğum Tarihi */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Doğum Tarihi</Text>
            <TextInput
              style={[styles.input, birthValid && styles.inputValid]}
              value={birthDate}
              onChangeText={t => setBirthDate(formatBirthDate(t, birthDate))}
              placeholder="GG/AA/YYYY"
              placeholderTextColor={colors.textTertiary}
              keyboardType="number-pad"
              maxLength={10}
            />
          </View>

          <View style={styles.notice}>
            <Text style={styles.noticeText}>
              🔒 Kimlik bilgileriniz 256-bit şifreleme ile korunmaktadır. KVKK kapsamında işlenmektedir.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button title="Devam" onPress={handleNext} disabled={!isValid} />
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>Geri</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },

  field: { marginBottom: spacing.lg },
  fieldLabel: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.xs },
  input: {
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    padding: spacing.md,
    ...typography.bodyLarge,
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  inputValid: { borderColor: colors.success },
  inputError: { borderColor: colors.error },
  errorText: { ...typography.caption, color: colors.error, marginTop: spacing.xs },
  successText: { ...typography.caption, color: colors.success, marginTop: spacing.xs },

  notice: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  noticeText: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 20 },

  footer: { paddingHorizontal: screenPaddingHorizontal, paddingBottom: 100, paddingTop: spacing.md, gap: spacing.sm },
  backBtn: { alignItems: 'center', paddingVertical: spacing.sm },
  backText: { ...typography.label, color: colors.textSecondary },
});
