import React, { useMemo, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

const MOCK_RECIPIENTS = [
  { id: '1', name: 'Apartman Yönetimi', iban: 'TR33 0006 1005 1978 6457 8413 26', nickname: 'Apartman' },
  { id: '2', name: 'Ev Sahibi', iban: 'TR52 0001 0017 4523 1850 3000 01', nickname: 'Ev Sahibi' },
  { id: '3', name: 'Site Yönetimi', iban: 'TR62 0013 4000 0147 4012 8100 09', nickname: 'Site' },
];

const FEE_RATE = 0.015;
const MAX_AMOUNT = 1000000;

function formatCurrencyInput(text) {
  const clean = text.replace(/[^0-9,]/g, '');
  const hasComma = clean.includes(',');
  const [leftRaw, rightRaw = ''] = clean.split(',');
  const integerRaw = leftRaw.replace(/^0+(?=\d)/, '') || '0';
  const integerFormatted = integerRaw.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  if (!hasComma) return integerFormatted;
  return `${integerFormatted},${rightRaw.slice(0, 2)}`;
}

function parseAmount(value) {
  const normalized = value.replace(/\./g, '').replace(',', '.');
  return Number.parseFloat(normalized) || 0;
}

function formatIban(text) {
  const clean = text.replace(/\s/g, '').toUpperCase();
  const parts = clean.match(/.{1,4}/g) || [];
  return parts.join(' ');
}

function normalizeIban(value) {
  return value.replace(/\s/g, '').toUpperCase();
}

function formatMoneyTr(value) {
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

export function PaymentAmountScreen({ navigation, route }) {
  const preselectedRecipient = route?.params?.preselectedRecipient ?? null;
  const origin = route?.params?.origin;

  const [amount, setAmount] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState(preselectedRecipient);
  const [showRecipients, setShowRecipients] = useState(false);
  const [recipientSearch, setRecipientSearch] = useState('');
  const [customIban, setCustomIban] = useState('');
  const [customName, setCustomName] = useState('');
  const [useCustom, setUseCustom] = useState(!preselectedRecipient);
  const [description, setDescription] = useState('');
  const [saveRecipient, setSaveRecipient] = useState(false);
  const [nickname, setNickname] = useState('');

  const numericAmount = parseAmount(amount);
  const fee = +(numericAmount * FEE_RATE).toFixed(2);
  const total = +(numericAmount + fee).toFixed(2);
  const exceedsMaxAmount = numericAmount > MAX_AMOUNT;

  const recipient = useCustom
    ? { name: customName.trim(), iban: customIban }
    : selectedRecipient;

  const filteredRecipients = useMemo(() => {
    const query = recipientSearch.trim().toLowerCase();
    const ibanQuery = normalizeIban(recipientSearch);
    return MOCK_RECIPIENTS.filter((r) => (
      r.name.toLowerCase().includes(query)
      || (r.nickname || '').toLowerCase().includes(query)
      || normalizeIban(r.iban).includes(ibanQuery)
    ));
  }, [recipientSearch]);

  const isValid = numericAmount > 0
    && !exceedsMaxAmount
    && (useCustom
      ? customName.trim().length > 1 && normalizeIban(customIban).length === 26
      : !!selectedRecipient);

  const amountDigitsLength = amount.replace(/\D/g, '').length;
  const amountFontSize = amountDigitsLength > 11 ? 28 : amountDigitsLength > 9 ? 32 : amountDigitsLength > 7 ? 36 : 42;
  const symbolFontSize = amountDigitsLength > 11 ? 22 : amountDigitsLength > 9 ? 26 : amountDigitsLength > 7 ? 30 : 36;

  const handleContinue = () => {
    navigation.navigate('PaymentSummary', {
      amount: numericAmount,
      fee,
      total,
      recipient,
      description: description.trim(),
      saveRecipient: useCustom && saveRecipient,
      nickname: nickname.trim(),
      origin,
    });
  };

  const handleBack = () => {
    if (origin === 'Recipients' || origin === 'Dashboard') {
      navigation.getParent()?.navigate(origin === 'Recipients' ? 'Recipients' : 'Dashboard');
      return;
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.back} onPress={handleBack}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Yeni Ödeme</Text>
          <Text style={styles.subtitle}>Kredi kartınla kira, aidat ve fatura öde.</Text>

          <View style={styles.section}>
            <Text style={styles.label}>Gönderilecek Tutar</Text>
            <View style={styles.amountWrapper}>
              <View style={styles.amountRow}>
                <Text style={[styles.currency, { fontSize: symbolFontSize }]}>₺</Text>
                <TextInput
                  style={[styles.amountInput, { fontSize: amountFontSize }]}
                  value={amount}
                  onChangeText={t => setAmount(formatCurrencyInput(t))}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={colors.textTertiary}
                  autoFocus
                  maxLength={16}
                />
              </View>
            </View>

            {exceedsMaxAmount ? (
              <Text style={styles.errorText}>Maksimum işlem tutarı aşıldı (1.000.000,00 TL).</Text>
            ) : null}

            {numericAmount > 0 ? (
              <View style={styles.feeCard}>
                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>Komisyon (%1,5)</Text>
                  <Text style={styles.feeValue}>₺{formatMoneyTr(fee)}</Text>
                </View>
                <View style={styles.feeRow}>
                  <Text style={styles.totalLabel}>Toplam Tutar</Text>
                  <Text style={styles.totalValue}>₺{formatMoneyTr(total)}</Text>
                </View>
              </View>
            ) : null}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.label}>Alıcı</Text>
              <TouchableOpacity onPress={() => {
                setUseCustom(!useCustom);
                setShowRecipients(false);
                setRecipientSearch('');
                if (!useCustom) setSelectedRecipient(null);
              }}>
                <Text style={styles.toggleBtn}>{useCustom ? 'Kayıtlıdan seç' : 'Manuel gir'}</Text>
              </TouchableOpacity>
            </View>

            {!useCustom ? (
              <>
                <TouchableOpacity
                  style={styles.recipientSelector}
                  onPress={() => setShowRecipients(!showRecipients)}
                >
                  <Text style={[styles.recipientSelectorText, !selectedRecipient && { color: colors.textTertiary }]}
                    numberOfLines={1}
                  >
                    {selectedRecipient ? selectedRecipient.name : 'Kayıtlı alıcı seçin'}
                  </Text>
                  <Text style={styles.chevron}>{showRecipients ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {showRecipients ? (
                  <View style={styles.recipientList}>
                    <View style={styles.recipientSearchWrap}>
                      <TextInput
                        style={styles.recipientSearchInput}
                        value={recipientSearch}
                        onChangeText={setRecipientSearch}
                        placeholder="Alıcı ara..."
                        placeholderTextColor={colors.textTertiary}
                        autoCapitalize="none"
                      />
                    </View>

                    {filteredRecipients.length === 0 ? (
                      <Text style={styles.recipientEmpty}>Eşleşen alıcı bulunamadı.</Text>
                    ) : filteredRecipients.map((r) => (
                      <TouchableOpacity
                        key={r.id}
                        style={styles.recipientItem}
                        onPress={() => {
                          setSelectedRecipient(r);
                          setShowRecipients(false);
                          setRecipientSearch('');
                        }}
                      >
                        <View style={styles.recipientAvatar}>
                          <Text style={styles.recipientAvatarText}>{r.name[0]}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.recipientName}>{r.name}</Text>
                          <Text style={styles.recipientIban}>{r.iban}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}

                {selectedRecipient ? (
                  <View style={styles.selectedCard}>
                    <Text style={styles.selectedName}>{selectedRecipient.name}</Text>
                    <Text style={styles.selectedIban}>{selectedRecipient.iban}</Text>
                  </View>
                ) : null}
              </>
            ) : (
              <>
                <TextInput
                  style={styles.input}
                  value={customName}
                  onChangeText={setCustomName}
                  placeholder="Ad Soyad veya Kurum Adı"
                  placeholderTextColor={colors.textTertiary}
                />
                <TextInput
                  style={[styles.input, { marginTop: spacing.sm, letterSpacing: 1.5 }]}
                  value={customIban}
                  onChangeText={t => setCustomIban(formatIban(t))}
                  placeholder="TR00 0000 0000 0000 0000 0000 00"
                  placeholderTextColor={colors.textTertiary}
                  autoCapitalize="characters"
                  maxLength={32}
                />

                {normalizeIban(customIban).length === 26 ? (
                  <View style={styles.ibanNote}>
                    <Text style={styles.ibanNoteIcon}>ℹ</Text>
                    <Text style={styles.ibanNoteText}>
                      IBAN doğrulaması ödeme kuruluşu API'si entegre edildiğinde aktif olacak.
                    </Text>
                  </View>
                ) : null}

                {customName.trim().length > 1 && normalizeIban(customIban).length === 26 ? (
                  <View style={styles.saveSection}>
                    <TouchableOpacity
                      style={styles.saveRow}
                      onPress={() => setSaveRecipient(!saveRecipient)}
                    >
                      <View style={[styles.checkbox, saveRecipient && styles.checkboxActive]}>
                        {saveRecipient ? <Text style={styles.checkmark}>✓</Text> : null}
                      </View>
                      <Text style={styles.saveText}>Bu alıcıyı kaydet</Text>
                    </TouchableOpacity>

                    {saveRecipient ? (
                      <TextInput
                        style={[styles.input, { marginTop: spacing.sm }]}
                        value={nickname}
                        onChangeText={setNickname}
                        placeholder='Kısa ad (Orn. "Ev Sahibi", "Apartman")'
                        placeholderTextColor={colors.textTertiary}
                      />
                    ) : null}
                  </View>
                ) : null}
              </>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Açıklama <Text style={styles.optional}>(isteğe bağlı)</Text></Text>
            <TextInput
              style={[styles.input, { minHeight: 64, textAlignVertical: 'top' }]}
              value={description}
              onChangeText={setDescription}
              placeholder='Orn. "Nisan 2026 kirası", "Ocak aidatı"'
              placeholderTextColor={colors.textTertiary}
              multiline
              maxLength={100}
            />
            <Text style={styles.charCount}>{description.length}/100</Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button title="Devam" onPress={handleContinue} disabled={!isValid} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scroll: {
    paddingHorizontal: screenPaddingHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  back: { alignSelf: 'flex-start', marginBottom: spacing.xl },
  backArrow: { fontSize: 24, color: colors.textPrimary },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },

  section: { marginBottom: spacing.xl },
  label: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.sm },
  optional: { ...typography.caption, color: colors.textTertiary, fontWeight: '400' },

  amountWrapper: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundElevated,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    gap: spacing.xs,
  },
  currency: {
    fontFamily: 'DMSans_700Bold',
    color: colors.textPrimary,
  },
  amountInput: {
    flex: 1,
    fontFamily: 'DMSans_700Bold',
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  errorText: { ...typography.caption, color: colors.error, marginTop: spacing.xs },
  feeCard: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  feeLabel: { ...typography.bodySmall, color: colors.textSecondary },
  feeValue: { ...typography.label, color: colors.textPrimary },
  totalLabel: { ...typography.label, color: colors.primary },
  totalValue: { ...typography.h3, color: colors.primary },

  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  toggleBtn: { ...typography.label, color: colors.accent },

  recipientSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    padding: spacing.md,
  },
  recipientSelectorText: { ...typography.body, color: colors.textPrimary, flex: 1, marginRight: spacing.sm },
  chevron: { color: colors.textTertiary, fontSize: 12 },

  recipientList: {
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  recipientSearchWrap: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  recipientSearchInput: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  recipientEmpty: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  recipientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  recipientAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  recipientAvatarText: { ...typography.label, color: colors.textInverse },
  recipientName: { ...typography.label, color: colors.textPrimary },
  recipientIban: { ...typography.caption, color: colors.textTertiary, marginTop: 1 },

  selectedCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  selectedName: { ...typography.label, color: colors.primary },
  selectedIban: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },

  input: {
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    padding: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
  },

  ibanNote: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
    alignItems: 'flex-start',
  },
  ibanNoteIcon: { color: colors.textTertiary, fontSize: 13 },
  ibanNoteText: { ...typography.caption, color: colors.textTertiary, flex: 1 },

  saveSection: { marginTop: spacing.md },
  saveRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
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
  saveText: { ...typography.body, color: colors.textPrimary },

  charCount: { ...typography.caption, color: colors.textTertiary, textAlign: 'right', marginTop: 4 },

  footer: {
    paddingHorizontal: screenPaddingHorizontal,
    paddingBottom: 100,
    paddingTop: spacing.md,
  },
});
