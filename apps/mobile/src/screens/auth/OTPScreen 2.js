import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 60;

export function OTPScreen({ route, navigation }) {
  const phone = route?.params?.phone ?? '';
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const handleCodeChange = (text) => {
    const digits = text.replace(/\D/g, '').slice(0, CODE_LENGTH);
    setCode(digits);
    if (digits.length === CODE_LENGTH) {
      handleVerify(digits);
    }
  };

  const handleVerify = (finalCode = code) => {
    setLoading(true);
    // Mock doğrulama: 1 sn sonra başarılı kabul edilir; gerçek API bağlandığında değişecek.
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Main');
    }, 1000);
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(RESEND_SECONDS);
    setCode('');
  };

  const formattedPhone = phone
    ? `+90 ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`
    : '';

  // Görsel kutular için kod karakterleri
  const boxes = Array.from({ length: CODE_LENGTH }, (_, i) => code[i] ?? '');

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          {/* Geri */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          {/* Başlık */}
          <View style={styles.header}>
            <Text style={styles.title}>Doğrulama{'\n'}kodunu girin</Text>
            {formattedPhone ? (
              <Text style={styles.subtitle}>
                <Text style={styles.phoneHighlight}>{formattedPhone}</Text>
                {' '}numarasına gönderilen 6 haneli kodu girin.
              </Text>
            ) : (
              <Text style={styles.subtitle}>
                Telefonunuza gönderilen 6 haneli kodu girin.
              </Text>
            )}
          </View>

          {/* OTP kutular */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => inputRef.current?.focus()}
          >
            <View style={styles.boxRow}>
              {boxes.map((char, i) => (
                <View
                  key={i}
                  style={[
                    styles.box,
                    char && styles.boxFilled,
                    i === code.length && styles.boxActive,
                  ]}
                >
                  <Text style={styles.boxChar}>{char}</Text>
                  {i === code.length && !char && (
                    <View style={styles.cursor} />
                  )}
                </View>
              ))}
            </View>
          </TouchableOpacity>

          {/* Gizli input */}
          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={handleCodeChange}
            keyboardType="number-pad"
            maxLength={CODE_LENGTH}
            style={styles.hiddenInput}
            autoFocus
          />

          {/* Tekrar gönder */}
          <View style={styles.resendRow}>
            {countdown > 0 ? (
              <Text style={styles.resendWait}>
                Kodu tekrar gönder{' '}
                <Text style={styles.resendTimer}>{countdown}s</Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend}>
                <Text style={styles.resendBtn}>Kodu tekrar gönder</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Doğrula butonu */}
        <View style={styles.footer}>
          <Button
            title="Doğrula"
            onPress={() => handleVerify()}
            disabled={code.length < CODE_LENGTH}
            loading={loading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: screenPaddingHorizontal,
    paddingTop: spacing.sm,
  },
  backBtn: { alignSelf: 'flex-start', marginBottom: spacing.xl },
  backArrow: { fontSize: 24, color: colors.textPrimary },
  header: { marginBottom: spacing.xl },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
  phoneHighlight: { ...typography.body, fontWeight: '600', color: colors.textPrimary },

  boxRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  box: {
    flex: 1,
    height: 60,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxFilled: {
    borderColor: colors.accent,
    backgroundColor: colors.backgroundElevated,
  },
  boxActive: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  boxChar: {
    ...typography.h2,
    color: colors.textPrimary,
    letterSpacing: 0,
  },
  cursor: {
    width: 2,
    height: 24,
    backgroundColor: colors.accent,
    borderRadius: 1,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },

  resendRow: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  resendWait: { ...typography.body, color: colors.textTertiary },
  resendTimer: { ...typography.body, color: colors.accent, fontWeight: '600' },
  resendBtn: { ...typography.label, color: colors.accent },

  footer: {
    paddingHorizontal: screenPaddingHorizontal,
    paddingBottom: Platform.OS === 'ios' ? spacing.lg : spacing.xl,
    paddingTop: spacing.md,
  },
});
