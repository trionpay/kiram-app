import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

const CODE_LENGTH = 6;

export function ForgotPasswordScreen({ navigation }) {
  const [step, setStep] = useState('phone'); // phone → otp → newPassword
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const formatted = () => {
    if (phone.length <= 3) return phone;
    if (phone.length <= 6) return `${phone.slice(0, 3)} ${phone.slice(3)}`;
    return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
  };

  useEffect(() => {
    if (step !== 'otp' || countdown <= 0) return;
    const t = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [step, countdown]);

  const handleSendCode = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('otp'); setCountdown(60); }, 1000);
  };

  const handleVerifyCode = (c = code) => {
    if (c.length < CODE_LENGTH) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('newPassword'); }, 1000);
  };

  const handleChangeCode = (text) => {
    const digits = text.replace(/\D/g, '').slice(0, CODE_LENGTH);
    setCode(digits);
    if (digits.length === CODE_LENGTH) handleVerifyCode(digits);
  };

  const handleResetPassword = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); navigation.replace('Login'); }, 1000);
  };

  const boxes = Array.from({ length: CODE_LENGTH }, (_, i) => code[i] ?? '');
  const passwordsMatch = newPassword === confirmPassword;
  const passwordValid = newPassword.length >= 8 && confirmPassword.length >= 8 && passwordsMatch;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.back} onPress={() => step === 'phone' ? navigation.goBack() : setStep(step === 'otp' ? 'phone' : 'otp')}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          {step === 'phone' && (
            <>
              <Text style={styles.title}>Şifremi Unuttum</Text>
              <Text style={styles.subtitle}>Telefon numaranıza doğrulama kodu göndereceğiz.</Text>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Telefon Numarası</Text>
                <View style={styles.phoneRow}>
                  <Text style={styles.flag}>🇹🇷</Text>
                  <Text style={styles.prefix}>+90</Text>
                  <View style={styles.divider} />
                  <TextInput
                    style={styles.phoneInput}
                    value={formatted()}
                    onChangeText={t => setPhone(t.replace(/\D/g, '').slice(0, 10))}
                    keyboardType="number-pad"
                    placeholder="555 123 4567"
                    placeholderTextColor={colors.textTertiary}
                    autoFocus
                  />
                </View>
              </View>
            </>
          )}

          {step === 'otp' && (
            <>
              <Text style={styles.title}>Doğrulama Kodu</Text>
              <Text style={styles.subtitle}>+90 {formatted()} numarasına gönderilen kodu girin.</Text>
              <TouchableOpacity activeOpacity={1} onPress={() => inputRef.current?.focus()}>
                <View style={styles.boxRow}>
                  {boxes.map((ch, i) => (
                    <View key={i} style={[styles.box, ch && styles.boxFilled, i === code.length && styles.boxActive]}>
                      <Text style={styles.boxChar}>{ch}</Text>
                      {i === code.length && !ch && <View style={styles.cursor} />}
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
              <TextInput ref={inputRef} value={code} onChangeText={handleChangeCode} keyboardType="number-pad" maxLength={CODE_LENGTH} style={styles.hidden} autoFocus />
              <View style={styles.resendRow}>
                {countdown > 0
                  ? <Text style={styles.resendWait}>Kodu tekrar gönder <Text style={styles.timer}>{countdown}s</Text></Text>
                  : <TouchableOpacity onPress={() => { setCountdown(60); setCode(''); }}><Text style={styles.resendBtn}>Kodu tekrar gönder</Text></TouchableOpacity>
                }
              </View>
            </>
          )}

          {step === 'newPassword' && (
            <>
              <Text style={styles.title}>Yeni Şifre</Text>
              <Text style={styles.subtitle}>En az 8 karakter içeren yeni şifrenizi belirleyin.</Text>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Yeni Şifre</Text>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="En az 8 karakter"
                  placeholderTextColor={colors.textTertiary}
                  secureTextEntry
                  autoFocus
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Şifre Tekrar</Text>
                <TextInput
                  style={[styles.input, confirmPassword.length > 0 && !passwordsMatch && { borderColor: colors.error }]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Şifreyi tekrar girin"
                  placeholderTextColor={colors.textTertiary}
                  secureTextEntry
                />
                {confirmPassword.length > 0 && !passwordsMatch && (
                  <Text style={styles.errorText}>Şifreler eşleşmiyor</Text>
                )}
              </View>
            </>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {step === 'phone' && (
            <Button title="Kod Gönder" onPress={handleSendCode} disabled={phone.length < 10} loading={loading} />
          )}
          {step === 'otp' && (
            <Button title="Doğrula" onPress={() => handleVerifyCode()} disabled={code.length < CODE_LENGTH} loading={loading} />
          )}
          {step === 'newPassword' && (
            <Button title="Şifremi Güncelle" onPress={handleResetPassword} disabled={!passwordValid} loading={loading} />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: screenPaddingHorizontal, paddingTop: spacing.lg, paddingBottom: spacing.md },
  back: { alignSelf: 'flex-start', marginBottom: spacing.xl },
  backArrow: { fontSize: 24, color: colors.textPrimary },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  field: { marginBottom: spacing.lg },
  fieldLabel: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.xs },

  phoneRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.backgroundElevated, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, paddingHorizontal: spacing.md, height: 56, gap: spacing.xs },
  flag: { fontSize: 20 },
  prefix: { ...typography.label, color: colors.textPrimary },
  divider: { width: 1.5, height: 22, backgroundColor: colors.border, marginHorizontal: spacing.xs },
  phoneInput: { flex: 1, ...typography.bodyLarge, color: colors.textPrimary, letterSpacing: 1 },

  boxRow: { flexDirection: 'row', gap: spacing.sm, marginVertical: spacing.sm },
  box: { flex: 1, height: 58, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.backgroundElevated, alignItems: 'center', justifyContent: 'center' },
  boxFilled: { borderColor: colors.accent },
  boxActive: { borderColor: colors.primary, borderWidth: 2 },
  boxChar: { ...typography.h2, color: colors.textPrimary },
  cursor: { width: 2, height: 24, backgroundColor: colors.accent, borderRadius: 1 },
  hidden: { position: 'absolute', opacity: 0, width: 1, height: 1 },
  resendRow: { alignItems: 'center', marginTop: spacing.xl },
  resendWait: { ...typography.body, color: colors.textTertiary },
  timer: { color: colors.accent, fontWeight: '600' },
  resendBtn: { ...typography.label, color: colors.accent },

  input: { backgroundColor: colors.backgroundElevated, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, padding: spacing.md, ...typography.bodyLarge, color: colors.textPrimary },
  errorText: { ...typography.caption, color: colors.error, marginTop: spacing.xs },

  footer: { paddingHorizontal: screenPaddingHorizontal, paddingBottom: 12, paddingTop: spacing.sm },
});
