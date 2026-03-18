import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

/** Luhn algoritması ile kart doğrulama */
function luhnCheck(num) {
  const digits = num.replace(/\D/g, '');
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

function getCardType(num) {
  const n = num.replace(/\s/g, '');
  if (/^4/.test(n)) return 'Visa';
  if (/^5[1-5]/.test(n)) return 'Mastercard';
  if (/^3[47]/.test(n)) return 'Amex';
  return '';
}

// Mock kayıtlı kartlar — 3. parti kart saklama API'si entegre edilince gerçek liste gelecek
const MOCK_SAVED_CARDS = [
  { id: 'c1', holder: 'BARAN BEDİR', last4: '0366', expiry: '12/26', type: 'Visa' },
  { id: 'c2', holder: 'BARAN BEDİR', last4: '4242', expiry: '08/27', type: 'Mastercard' },
];

export function CardInputScreen({ route, navigation }) {
  const { amount, fee, total, recipient, description } = route.params;
  const [selectedSavedCard, setSelectedSavedCard] = useState(null);
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  const fillSavedCard = (card) => {
    setSelectedSavedCard(card.id);
    setCardHolder(card.holder);
    setCardNumber('•••• •••• •••• ' + card.last4);
    setExpiry(card.expiry);
    setCvv('');
  };

  const expiryRef = useRef(null);
  const cvvRef = useRef(null);

  const rawCard = cardNumber.replace(/\s/g, '');
  const cardType = getCardType(rawCard);
  const isCardValid = rawCard.length >= 15 && luhnCheck(rawCard);
  const isExpiryValid = expiry.length === 5;
  const isCvvValid = cvv.length >= 3;
  const isHolderValid = cardHolder.trim().length > 3;
  const isValid = isCardValid && isExpiryValid && isCvvValid && isHolderValid;

  const formatCardNumber = (text) => {
    const clean = text.replace(/\D/g, '').slice(0, 16);
    const parts = clean.match(/.{1,4}/g) || [];
    setCardNumber(parts.join(' '));
    if (clean.length === 16) expiryRef.current?.focus();
  };

  const formatExpiry = (text) => {
    const clean = text.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 3) {
      setExpiry(`${clean.slice(0, 2)}/${clean.slice(2)}`);
    } else {
      setExpiry(clean);
    }
    if (clean.length === 4) cvvRef.current?.focus();
  };

  const handlePay = () => {
    navigation.navigate('ThreeDSecure', { amount, fee, total, recipient, description });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Geri */}
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Kart Bilgileri</Text>
          <Text style={styles.subtitle}>Kayıtlı kartınızı seçin veya yeni kart bilgisi girin.</Text>

          {/* Kayıtlı kartlar */}
          <View style={styles.savedSection}>
            <Text style={styles.savedLabel}>Kayıtlı Kartlar</Text>
            {MOCK_SAVED_CARDS.map(card => (
              <TouchableOpacity
                key={card.id}
                style={[styles.savedCard, selectedSavedCard === card.id && styles.savedCardActive]}
                onPress={() => fillSavedCard(card)}
                activeOpacity={0.7}
              >
                <View style={styles.savedCardLeft}>
                  <View style={styles.savedCardIcon}>
                    <Text style={styles.savedCardIconText}>{card.type === 'Visa' ? 'V' : 'M'}</Text>
                  </View>
                  <View>
                    <Text style={styles.savedCardNum}>•••• {card.last4}</Text>
                    <Text style={styles.savedCardExp}>{card.holder} · {card.expiry}</Text>
                  </View>
                </View>
                <View style={[styles.savedCardCheck, selectedSavedCard === card.id && styles.savedCardCheckActive]}>
                  {selectedSavedCard === card.id && <Text style={styles.savedCardCheckText}>✓</Text>}
                </View>
              </TouchableOpacity>
            ))}
            <Text style={styles.savedNote}>
              Kart saklama PCI-DSS uyumlu 3. parti servis (Sipay vb.) üzerinden çalışır.
            </Text>
          </View>

          <View style={styles.orDivider}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>veya yeni kart</Text>
            <View style={styles.orLine} />
          </View>

          {/* Kart önizleme */}
          <View style={styles.cardPreview}>
            <View style={styles.cardChip} />
            <Text style={styles.cardNumberPreview}>
              {cardNumber || '•••• •••• •••• ••••'}
            </Text>
            <View style={styles.cardBottom}>
              <View>
                <Text style={styles.cardPreviewLabel}>Kart Sahibi</Text>
                <Text style={styles.cardPreviewValue}>
                  {cardHolder.trim().toUpperCase() || 'AD SOYAD'}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.cardPreviewLabel}>Son Kullanma</Text>
                <Text style={styles.cardPreviewValue}>{expiry || 'AA/YY'}</Text>
              </View>
            </View>
            {isCardValid && <View style={styles.validBadge}><Text style={styles.validBadgeText}>✓</Text></View>}
          </View>

          {/* Kart sahibi */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Kart Üzerindeki Ad Soyad</Text>
            <TextInput
              style={styles.input}
              value={cardHolder}
              onChangeText={setCardHolder}
              placeholder="AD SOYAD"
              placeholderTextColor={colors.textTertiary}
              autoCapitalize="characters"
              returnKeyType="next"
            />
          </View>

          {/* Kart numarası */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Kart Numarası</Text>
            <TextInput
              style={[styles.input, isCardValid && styles.inputValid]}
              value={cardNumber}
              onChangeText={formatCardNumber}
              keyboardType="number-pad"
              placeholder="0000 0000 0000 0000"
              placeholderTextColor={colors.textTertiary}
              maxLength={19}
            />
          </View>

          {/* SKT + CVV */}
          <View style={styles.row}>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Son Kullanma</Text>
              <TextInput
                ref={expiryRef}
                style={styles.input}
                value={expiry}
                onChangeText={formatExpiry}
                keyboardType="number-pad"
                placeholder="AA/YY"
                placeholderTextColor={colors.textTertiary}
                maxLength={5}
              />
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>CVV</Text>
              <TextInput
                ref={cvvRef}
                style={styles.input}
                value={cvv}
                onChangeText={(t) => setCvv(t.replace(/\D/g, '').slice(0, 4))}
                keyboardType="number-pad"
                placeholder="•••"
                placeholderTextColor={colors.textTertiary}
                secureTextEntry
                maxLength={4}
              />
            </View>
          </View>

          {/* Kart kaydet */}
          <TouchableOpacity style={styles.saveRow} onPress={() => setSaveCard(!saveCard)}>
            <View style={[styles.checkbox, saveCard && styles.checkboxActive]}>
              {saveCard && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.saveText}>Kartı sonraki işlemler için kaydet</Text>
          </TouchableOpacity>

          <Text style={styles.pciNote}>
            Kart bilgileriniz PCI-DSS standartlarında şifrelenir. Blurple sunucularında saklanmaz.
          </Text>
        </ScrollView>

        {/* Ödeme yap */}
        <View style={styles.footer}>
          <Button
            title={`₺${total?.toFixed(2).replace('.', ',')} Öde`}
            onPress={handlePay}
            disabled={!isValid}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: screenPaddingHorizontal, paddingTop: spacing.lg, paddingBottom: 100 },
  back: { alignSelf: 'flex-start', marginBottom: spacing.xl },
  backArrow: { fontSize: 24, color: colors.textPrimary },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },

  cardPreview: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    minHeight: 160,
    justifyContent: 'space-between',
  },
  cardChip: {
    width: 36,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    marginBottom: spacing.md,
  },
  cardNumberPreview: {
    ...typography.h3,
    color: colors.textInverse,
    letterSpacing: 3,
    marginBottom: spacing.xl,
    opacity: 0.9,
  },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardPreviewLabel: { ...typography.caption, color: 'rgba(255,255,255,0.5)', marginBottom: 2 },
  cardPreviewValue: { ...typography.label, color: colors.textInverse },
  cardTypeText: { ...typography.label, color: colors.textInverse, opacity: 0.8 },
  validBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.success,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  validBadgeText: { color: colors.textInverse, fontSize: 12, fontWeight: '700' },

  field: { marginBottom: spacing.md },
  fieldLabel: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.xs },
  input: {
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    padding: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  inputValid: { borderColor: colors.success },

  row: { flexDirection: 'row', gap: spacing.md },

  saveRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  checkmark: { color: colors.textInverse, fontSize: 12, fontWeight: '700' },
  saveText: { ...typography.body, color: colors.textSecondary },

  pciNote: { ...typography.caption, color: colors.textTertiary, textAlign: 'center', lineHeight: 18 },

  savedSection: { marginBottom: spacing.sm },
  savedLabel: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.sm },
  savedCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.backgroundElevated, borderRadius: 14,
    borderWidth: 1.5, borderColor: colors.border, padding: spacing.md,
    marginBottom: spacing.sm,
  },
  savedCardActive: { borderColor: colors.accent, backgroundColor: '#EFF6FF' },
  savedCardLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  savedCardIcon: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  savedCardIconText: { ...typography.label, color: colors.textInverse },
  savedCardNum: { ...typography.label, color: colors.textPrimary },
  savedCardExp: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  savedCardCheck: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  savedCardCheckActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  savedCardCheckText: { color: colors.textInverse, fontSize: 12, fontWeight: '700' },
  savedNote: { ...typography.caption, color: colors.textTertiary, marginTop: spacing.xs },

  orDivider: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginVertical: spacing.lg },
  orLine: { flex: 1, height: 1, backgroundColor: colors.border },
  orText: { ...typography.caption, color: colors.textTertiary },

  footer: {
    paddingHorizontal: screenPaddingHorizontal,
    paddingBottom: 100,
    paddingTop: spacing.md,
  },
});
