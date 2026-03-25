import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

export function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');

  const handlePhoneChange = (text) => {
    const digits = text.replace(/\D/g, '');
    if (digits.length <= 10) setPhone(digits);
  };

  const formattedPhone = () => {
    if (phone.length <= 3) return phone;
    if (phone.length <= 6) return `${phone.slice(0, 3)} ${phone.slice(3)}`;
    return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
  };

  const isValid = phone.length === 10;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Geri butonu */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          {/* Başlık */}
          <View style={styles.header}>
            <Text style={styles.title}>Telefon{'\n'}numaranız</Text>
            <Text style={styles.subtitle}>
              Hesabınıza giriş yapmak veya yeni hesap oluşturmak için telefon numaranızı girin.
            </Text>
          </View>

          {/* Telefon alanı */}
          <View style={styles.inputWrapper}>
            <View style={styles.prefixBox}>
              <Text style={styles.flag}>🇹🇷</Text>
              <Text style={styles.prefix}>+90</Text>
            </View>
            <View style={styles.divider} />
            <TextInput
              style={styles.input}
              value={formattedPhone()}
              onChangeText={handlePhoneChange}
              keyboardType="number-pad"
              placeholder="555 123 4567"
              placeholderTextColor={colors.textTertiary}
              maxLength={12}
              autoFocus
            />
          </View>

          <Text style={styles.hint}>
            Numaranıza tek kullanımlık doğrulama kodu gönderilecektir.
          </Text>
        </ScrollView>

        {/* Devam butonu */}
        <View style={styles.footer}>
          <Button
            title="Kodu Gönder"
            onPress={() => navigation.navigate('OTP', { phone })}
            disabled={!isValid}
            style={styles.btn}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: screenPaddingHorizontal,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: spacing.xl,
  },
  backArrow: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    height: 58,
  },
  prefixBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingRight: spacing.sm,
  },
  flag: {
    fontSize: 20,
  },
  prefix: {
    ...typography.label,
    color: colors.textPrimary,
  },
  divider: {
    width: 1.5,
    height: 22,
    backgroundColor: colors.border,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.bodyLarge,
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  hint: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginTop: spacing.md,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: screenPaddingHorizontal,
    paddingBottom: Platform.OS === 'ios' ? spacing.lg : spacing.xl,
    paddingTop: spacing.md,
  },
  btn: { width: '100%' },
});
