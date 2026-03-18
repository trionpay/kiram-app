import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, ActivityIndicator, Platform, KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

/**
 * Fatura kategorileri ve mock kurum listesi.
 * API bağlandığında bu liste dinamik olarak API'den çekilecek.
 */
// color: şirket rengi, initials: logo baş harfleri
const CATEGORIES = [
  {
    id: 'electricity',
    icon: '⚡',
    label: 'Elektrik',
    companies: [
      { id: 'e1', name: 'AYEDAŞ', initials: 'AY', color: '#F59E0B' },
      { id: 'e2', name: 'BEDAŞ', initials: 'BE', color: '#EF4444' },
      { id: 'e3', name: 'Toroslar EDAŞ', initials: 'TE', color: '#10B981' },
      { id: 'e4', name: 'Başkent EDAŞ', initials: 'BŞ', color: '#6366F1' },
    ],
  },
  {
    id: 'water',
    icon: '💧',
    label: 'Su',
    companies: [
      { id: 'w1', name: 'İSKİ', initials: 'İS', color: '#0EA5E9' },
      { id: 'w2', name: 'ASKİ', initials: 'AS', color: '#06B6D4' },
      { id: 'w3', name: 'İZSU', initials: 'İZ', color: '#3B82F6' },
    ],
  },
  {
    id: 'gas',
    icon: '🔥',
    label: 'Doğalgaz',
    companies: [
      { id: 'g1', name: 'İGDAŞ', initials: 'İG', color: '#F97316' },
      { id: 'g2', name: 'Bursagaz', initials: 'BG', color: '#EF4444' },
      { id: 'g3', name: 'Akenerji', initials: 'AK', color: '#8B5CF6' },
    ],
  },
  {
    id: 'internet',
    icon: '📶',
    label: 'Telekom',
    companies: [
      { id: 'i1', name: 'Türk Telekom', initials: 'TT', color: '#3B82F6' },
      { id: 'i2', name: 'Vodafone', initials: 'VF', color: '#EF4444' },
      { id: 'i3', name: 'Turkcell SOS', initials: 'SO', color: '#F59E0B' },
      { id: 'i4', name: 'Turkcell', initials: 'TC', color: '#F59E0B' },
    ],
  },
];

const STEPS = ['category', 'company', 'subscriber', 'result'];

export function BillPaymentScreen({ navigation }) {
  const [step, setStep] = useState('category');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [subscriberNo, setSubscriberNo] = useState('');
  const [querying, setQuerying] = useState(false);
  const [billResult, setBillResult] = useState(null);

  const category = CATEGORIES.find(c => c.id === selectedCategory);

  const handleQueryBill = () => {
    if (subscriberNo.length < 6) return;
    setQuerying(true);
    // Mock: API bağlandığında gerçek borç sorgusu yapılacak
    setTimeout(() => {
      setQuerying(false);
      setBillResult({
        amount: (Math.floor(Math.random() * 800) + 100) + 0.99,
        period: 'Mart 2026',
        dueDate: '31 Mart 2026',
      });
      setStep('result');
    }, 1500);
  };

  const handlePay = () => {
    const company = category?.companies.find(c => c.id === selectedCompany);
    const fee = +(billResult.amount * 0.015).toFixed(2);
    const total = +(billResult.amount + fee).toFixed(2);
    navigation.navigate('PaymentSummary', {
      amount: billResult.amount,
      fee,
      total,
      recipient: { name: company?.name, iban: 'Fatura Bayiliği API' },
      description: `${company?.name} — ${billResult.period} faturası`,
    });
  };

  const fmt = (n) => (n || 0).toFixed(2).replace('.', ',');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.back}
          onPress={() => {
            if (step === 'category') navigation.goBack();
            else if (step === 'company') setStep('category');
            else if (step === 'subscriber') setStep('company');
            else if (step === 'result') { setStep('subscriber'); setBillResult(null); }
          }}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        {/* Adım göstergesi */}
        <View style={styles.stepRow}>
          {STEPS.map((s, i) => (
            <View
              key={s}
              style={[
                styles.stepDot,
                STEPS.indexOf(step) >= i && styles.stepDotActive,
              ]}
            />
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ADIM 1: Kategori seç */}
        {step === 'category' && (
          <>
            <Text style={styles.title}>Fatura kategorisi</Text>
            <Text style={styles.subtitle}>Ödemek istediğiniz fatura türünü seçin.</Text>
            <View style={styles.grid}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryCard, selectedCategory === cat.id && styles.categoryCardActive]}
                  onPress={() => { setSelectedCategory(cat.id); setStep('company'); }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text style={[styles.categoryLabel, selectedCategory === cat.id && { color: colors.textInverse }]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* ADIM 2: Kurum seç */}
        {step === 'company' && category && (
          <>
            <Text style={styles.title}>{category.icon} {category.label}</Text>
            <Text style={styles.subtitle}>Kurumunuzu seçin.</Text>
            <View style={styles.companyList}>
              {category.companies.map(co => (
                <TouchableOpacity
                  key={co.id}
                  style={[styles.companyRow, selectedCompany === co.id && styles.companyRowActive]}
                  onPress={() => { setSelectedCompany(co.id); setStep('subscriber'); }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.companyLogo, { backgroundColor: co.color }]}>
                    <Text style={styles.companyLogoText}>{co.initials}</Text>
                  </View>
                  <Text style={[styles.companyName, selectedCompany === co.id && { color: colors.accent }]}>
                    {co.name}
                  </Text>
                  <Text style={styles.companyArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* ADIM 3: Abone/Tesisat No */}
        {step === 'subscriber' && (
          <>
            <Text style={styles.title}>
              {category?.companies.find(c => c.id === selectedCompany)?.name}
            </Text>
            <Text style={styles.subtitle}>Abone veya tesisat numaranızı girin.</Text>

            <View style={styles.section}>
              <Text style={styles.fieldLabel}>Abone / Tesisat No</Text>
              <TextInput
                style={styles.input}
                value={subscriberNo}
                onChangeText={setSubscriberNo}
                placeholder="Örn. 1234567890"
                placeholderTextColor={colors.textTertiary}
                keyboardType="number-pad"
                autoFocus
                maxLength={12}
              />
              <Text style={styles.hint}>
                Fatura veya dağıtım şirketi uygulamanızdan bulabilirsiniz.
              </Text>
            </View>
          </>
        )}

        {/* ADIM 4: Borç sonucu */}
        {step === 'result' && billResult && (
          <>
            <Text style={styles.title}>Borç Bilgisi</Text>
            <Text style={styles.subtitle}>Güncel borç bilginiz aşağıdadır.</Text>

            <View style={styles.billCard}>
              <View style={styles.billTop}>
                <Text style={styles.billCompany}>
                  {category?.companies.find(c => c.id === selectedCompany)?.name}
                </Text>
                <Text style={styles.billPeriod}>{billResult.period} Dönemi</Text>
              </View>
              <View style={styles.billAmountRow}>
                <Text style={styles.billAmountLabel}>Ödenecek Tutar</Text>
                <Text style={styles.billAmount}>₺{fmt(billResult.amount)}</Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Son Ödeme Tarihi</Text>
                <Text style={styles.billValue}>{billResult.dueDate}</Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Abone No</Text>
                <Text style={styles.billValue}>{subscriberNo}</Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Hizmet Bedeli (%1,5)</Text>
                <Text style={styles.billValue}>₺{fmt(billResult.amount * 0.015)}</Text>
              </View>
              <View style={[styles.billRow, styles.billTotalRow]}>
                <Text style={styles.billTotalLabel}>Toplam</Text>
                <Text style={styles.billTotalValue}>
                  ₺{fmt(billResult.amount + billResult.amount * 0.015)}
                </Text>
              </View>
            </View>

            <View style={styles.apiNote}>
              <Text style={styles.apiNoteText}>
                ℹ Borç bilgisi fatura bayiliği API'si entegrasyonu sonrası gerçek zamanlı güncellenecektir.
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      {/* Footer buton */}
      {step === 'subscriber' && (
        <View style={styles.footer}>
          {querying ? (
            <View style={styles.queryingRow}>
              <ActivityIndicator color={colors.accent} />
              <Text style={styles.queryingText}>Borç bilgisi sorgulanıyor...</Text>
            </View>
          ) : (
            <Button
              title="Borç Sorgula"
              onPress={handleQueryBill}
              disabled={subscriberNo.length < 6}
            />
          )}
        </View>
      )}

      {step === 'result' && billResult && (
        <View style={styles.footer}>
          <Button title="Ödemeye Devam" onPress={handlePay} />
        </View>
      )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenPaddingHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    justifyContent: 'space-between',
  },
  back: { padding: 4 },
  backArrow: { fontSize: 24, color: colors.textPrimary },
  stepRow: { flexDirection: 'row', gap: spacing.xs },
  stepDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.border,
  },
  stepDotActive: { backgroundColor: colors.accent },

  content: {
    paddingHorizontal: screenPaddingHorizontal,
    paddingBottom: 120,
    paddingTop: spacing.sm,
  },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },

  /* Kategori grid */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: colors.backgroundElevated,
    borderRadius: 18,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  categoryCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryIcon: { fontSize: 32 },
  categoryLabel: { ...typography.label, color: colors.textPrimary, textAlign: 'center', fontSize: 13 },

  /* Kurum listesi */
  companyList: { gap: spacing.sm },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
    borderRadius: 14,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  companyRowActive: { borderColor: colors.accent, backgroundColor: '#EFF6FF' },
  companyLogo: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  companyLogoText: {
    color: '#fff',
    fontFamily: 'DMSans_700Bold',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  companyName: { ...typography.label, color: colors.textPrimary, flex: 1 },
  companyArrow: { fontSize: 20, color: colors.textTertiary },

  /* Abone no */
  section: { marginBottom: spacing.xl },
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
  hint: { ...typography.caption, color: colors.textTertiary, marginTop: spacing.sm },

  /* Borç kartı */
  billCard: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 20,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  billTop: { marginBottom: spacing.lg },
  billCompany: { ...typography.h3, color: colors.textPrimary },
  billPeriod: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  billAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    marginBottom: spacing.md,
  },
  billAmountLabel: { ...typography.body, color: colors.textSecondary },
  billAmount: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, letterSpacing: -0.5 },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  billLabel: { ...typography.body, color: colors.textSecondary },
  billValue: { ...typography.body, color: colors.textPrimary },
  billTotalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
  },
  billTotalLabel: { ...typography.label, color: colors.textPrimary },
  billTotalValue: { ...typography.label, color: colors.accent, fontSize: 16 },

  apiNote: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
  },
  apiNoteText: { ...typography.caption, color: colors.textTertiary },

  queryingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 52,
  },
  queryingText: { ...typography.body, color: colors.textSecondary },

  footer: {
    paddingHorizontal: screenPaddingHorizontal,
    paddingBottom: 12,
    paddingTop: spacing.sm,
  },
});
