import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';
import { requestOtp } from '../../services/authApi';

export function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (text) => {
    const digits = text.replace(/\D/g, '');
    if (digits.length <= 10) setPhone(digits);
  };

  const formatted = () => {
    if (phone.length <= 3) return phone;
    if (phone.length <= 6) return `${phone.slice(0,3)} ${phone.slice(3)}`;
    return `${phone.slice(0,3)} ${phone.slice(3,6)} ${phone.slice(6)}`;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Telefon{'\n'}numaranız</Text>
          <Text style={styles.subtitle}>Giriş yapmak veya yeni hesap oluşturmak için telefon numaranızı girin.</Text>
          <View style={styles.inputRow}>
            <View style={styles.prefix}>
              <Text style={styles.flag}>🇹🇷</Text>
              <Text style={styles.prefixText}>+90</Text>
            </View>
            <View style={styles.divider} />
            <TextInput
              style={styles.input}
              value={formatted()}
              onChangeText={handleChange}
              keyboardType="number-pad"
              placeholder="555 123 4567"
              placeholderTextColor={colors.textTertiary}
              maxLength={12}
              autoFocus
            />
          </View>
          <Text style={styles.hint}>Numaranıza tek kullanımlık doğrulama kodu gönderilecektir.</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </ScrollView>
        <View style={styles.footer}>
          <Button
            title="Kodu Gönder"
            onPress={async () => {
              setError('');
              setLoading(true);
              try {
                const payload = await requestOtp(phone);
                navigation.navigate('OTP', {
                  phone,
                  expiresInSeconds: payload?.expiresInSeconds ?? 60,
                });
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Kod gönderilemedi.');
              } finally {
                setLoading(false);
              }
            }}
            disabled={phone.length < 10}
            loading={loading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: screenPaddingHorizontal, paddingTop: spacing.lg, paddingBottom: spacing.xl },
  back: { alignSelf: 'flex-start', marginBottom: spacing.xl },
  backArrow: { fontSize: 24, color: colors.textPrimary },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.backgroundElevated, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, paddingHorizontal: spacing.md, height: 58 },
  prefix: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingRight: spacing.sm },
  flag: { fontSize: 20 },
  prefixText: { ...typography.label, color: colors.textPrimary },
  divider: { width: 1.5, height: 22, backgroundColor: colors.border, marginRight: spacing.sm },
  input: { flex: 1, ...typography.bodyLarge, color: colors.textPrimary, letterSpacing: 1 },
  hint: { ...typography.bodySmall, color: colors.textTertiary, marginTop: spacing.md },
  error: { ...typography.bodySmall, color: colors.error, marginTop: spacing.sm },
  footer: { paddingHorizontal: screenPaddingHorizontal, paddingBottom: 12, paddingTop: spacing.sm },
});
