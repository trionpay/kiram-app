import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

const MOCK_RECIPIENTS = [
  { id: '1', name: 'Apartman Yönetimi', iban: 'TR33 0006 1005 1978 6457 8413 26' },
  { id: '2', name: 'Ev Sahibi', iban: 'TR52 0001 0017 4523 1850 3000 01' },
  { id: '3', name: 'Site Yönetimi', iban: 'TR62 0013 4000 0147 4012 8100 09' },
];

const FEE_RATE = 0.015; // %1.5 komisyon (mock)

export function PaymentAmountScreen({ navigation }) {
  const [amount, setAmount] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [showRecipients, setShowRecipients] = useState(false);
  const [customIban, setCustomIban] = useState('');
  const [customName, setCustomName] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const numericAmount = parseFloat(amount.replace(',', '.')) || 0;
  const fee = +(numericAmount * FEE_RATE).toFixed(2);
  const total = +(numericAmount + fee).toFixed(2);

  const recipient = useCustom
    ? { name: customName, iban: customIban }
    : selectedRecipient;

  const isValid = numericAmount > 0
    && (useCustom
      ? customName.length > 1 && customIban.replace(/\s/g, '').length === 26
      : !!selectedRecipient);

  const formatAmount = (text) => {
    const clean = text.replace(/[^0-9,]/g, '');
    setAmount(clean);
  };

  const formatIban = (text) => {
    const clean = text.replace(/\s/g, '').toUpperCase();
    const parts = clean.match(/.{1,4}/g) || [];
    setCustomIban(parts.join(' '));
  };

  const handleContinue = () => {
    navigation.navigate('PaymentSummary', {
      amount: numericAmount,
      fee,
      total,
      recipient,
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Geri */}
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Yeni Ödeme</Text>
          <Text style={styles.subtitle}>Tutar ve alıcı bilgilerini girin.</Text>

          {/* Tutar */}
          <View style={styles.section}>
            <Text style={styles.label}>Gönderilecek Tutar</Text>
            <View style={styles.amountRow}>
              <Text style={styles.currency}>₺</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={formatAmount}
                keyboardType="decimal-pad"
                placeholder="0,00"
                placeholderTextColor={colors.textTertiary}
                autoFocus
              />
            </View>
            {numericAmount > 0 && (
              <Text style={styles.feeHint}>
                Komisyon (%1,5): ₺{fee.toFixed(2).replace('.', ',')} · Toplam: ₺{total.toFixed(2).replace('.', ',')}
              </Text>
            )}
          </View>

          {/* Alıcı */}
          <View style={styles.section}>
            <View style={styles.recipientHeader}>
              <Text style={styles.label}>Alıcı</Text>
              <TouchableOpacity onPress={() => { setUseCustom(!useCustom); setSelectedRecipient(null); }}>
                <Text style={styles.toggleBtn}>{useCustom ? 'Kayıtlıdan seç' : 'Manuel gir'}</Text>
              </TouchableOpacity>
            </View>

            {!useCustom ? (
              <>
                <TouchableOpacity style={styles.recipientSelector} onPress={() => setShowRecipients(!showRecipients)}>
                  <Text style={[styles.recipientSelectorText, !selectedRecipient && { color: colors.textTertiary }]}>
                    {selectedRecipient ? selectedRecipient.name : 'Kayıtlı alıcı seçin'}
                  </Text>
                  <Text style={styles.chevron}>{showRecipients ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {showRecipients && (
                  <View style={styles.recipientList}>
                    {MOCK_RECIPIENTS.map(r => (
                      <TouchableOpacity
                        key={r.id}
                        style={styles.recipientItem}
                        onPress={() => { setSelectedRecipient(r); setShowRecipients(false); }}
                      >
                        <View style={styles.recipientAvatar}>
                          <Text style={styles.recipientAvatarText}>{r.name[0]}</Text>
                        </View>
                        <View>
                          <Text style={styles.recipientName}>{r.name}</Text>
                          <Text style={styles.recipientIban}>{r.iban}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {selectedRecipient && (
                  <View style={styles.selectedCard}>
                    <Text style={styles.selectedName}>{selectedRecipient.name}</Text>
                    <Text style={styles.selectedIban}>{selectedRecipient.iban}</Text>
                  </View>
                )}
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
                  onChangeText={formatIban}
                  placeholder="TR00 0000 0000 0000 0000 0000 00"
                  placeholderTextColor={colors.textTertiary}
                  autoCapitalize="characters"
                  maxLength={32}
                />
              </>
            )}
          </View>
        </ScrollView>

        {/* Devam */}
        <View style={styles.footer}>
          <Button title="Devam" onPress={handleContinue} disabled={!isValid} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: screenPaddingHorizontal, paddingTop: spacing.sm, paddingBottom: spacing.xl },
  back: { alignSelf: 'flex-start', marginBottom: spacing.xl },
  backArrow: { fontSize: 24, color: colors.textPrimary },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },

  section: { marginBottom: spacing.xl },
  label: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.sm },

  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  currency: { ...typography.hero, color: colors.textPrimary, fontSize: 36 },
  amountInput: { flex: 1, ...typography.hero, fontSize: 42, color: colors.textPrimary, letterSpacing: -1 },
  feeHint: { ...typography.caption, color: colors.textTertiary, marginTop: spacing.sm },

  recipientHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
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
  recipientSelectorText: { ...typography.body, color: colors.textPrimary },
  chevron: { color: colors.textTertiary, fontSize: 12 },

  recipientList: {
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    marginTop: spacing.xs,
    overflow: 'hidden',
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

  footer: {
    paddingHorizontal: screenPaddingHorizontal,
    paddingBottom: Platform.OS === 'ios' ? spacing.lg : spacing.xl,
    paddingTop: spacing.md,
  },
});
