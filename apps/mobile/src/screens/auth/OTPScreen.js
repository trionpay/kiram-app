import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

const CODE_LENGTH = 6;

export function OTPScreen({ route, navigation }) {
  const phone = route?.params?.phone ?? '';
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const handleChange = (text) => {
    const digits = text.replace(/\D/g, '').slice(0, CODE_LENGTH);
    setCode(digits);
    if (digits.length === CODE_LENGTH) verify(digits);
  };

  const verify = (c = code) => {
    setLoading(true);
    // Mock: API bağlandığında backend yeni/mevcut kullanıcı kontrolü yapacak.
    // Şimdilik her doğrulama KYC akışına yönlendiriyor (yeni kullanıcı senaryosu).
    // Mevcut kullanıcı için: navigation.replace('Main')
    setTimeout(() => { setLoading(false); navigation.replace('KYCName'); }, 1000);
  };

  const boxes = Array.from({ length: CODE_LENGTH }, (_, i) => code[i] ?? '');
  const fmtPhone = phone ? `+90 ${phone.slice(0,3)} ${phone.slice(3,6)} ${phone.slice(6)}` : '';

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Doğrulama{'\n'}kodunu girin</Text>
          {fmtPhone ? (
            <Text style={styles.subtitle}><Text style={styles.phoneHL}>{fmtPhone}</Text> numarasına gönderilen 6 haneli kodu girin.</Text>
          ) : (
            <Text style={styles.subtitle}>Telefonunuza gönderilen 6 haneli kodu girin.</Text>
          )}
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
          <TextInput ref={inputRef} value={code} onChangeText={handleChange} keyboardType="number-pad" maxLength={CODE_LENGTH} style={styles.hidden} autoFocus />
          <View style={styles.resendRow}>
            {countdown > 0
              ? <Text style={styles.resendWait}>Kodu tekrar gönder <Text style={styles.timer}>{countdown}s</Text></Text>
              : <TouchableOpacity onPress={() => { setCountdown(60); setCode(''); }}><Text style={styles.resendBtn}>Kodu tekrar gönder</Text></TouchableOpacity>
            }
          </View>
        </View>
        <View style={styles.footer}>
          <Button title="Doğrula" onPress={() => verify()} disabled={code.length < CODE_LENGTH} loading={loading} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: screenPaddingHorizontal, paddingTop: spacing.lg },
  back: { alignSelf: 'flex-start', marginBottom: spacing.xl },
  backArrow: { fontSize: 24, color: colors.textPrimary },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  phoneHL: { fontWeight: '600', color: colors.textPrimary },
  boxRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  box: { flex: 1, height: 60, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.backgroundElevated, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  boxFilled: { borderColor: colors.accent },
  boxActive: { borderColor: colors.primary, borderWidth: 2 },
  boxChar: { ...typography.h2, color: colors.textPrimary },
  cursor: { width: 2, height: 24, backgroundColor: colors.accent, borderRadius: 1, position: 'absolute' },
  hidden: { position: 'absolute', opacity: 0, width: 1, height: 1 },
  resendRow: { marginTop: spacing.xl, alignItems: 'center' },
  resendWait: { ...typography.body, color: colors.textTertiary },
  timer: { color: colors.accent, fontWeight: '600' },
  resendBtn: { ...typography.label, color: colors.accent },
  footer: { paddingHorizontal: screenPaddingHorizontal, paddingBottom: spacing.xxl, paddingTop: spacing.md },
});
