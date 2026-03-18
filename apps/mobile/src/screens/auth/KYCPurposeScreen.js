import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

const OPTIONS = [
  { id: 'rent', icon: '🏠', title: 'Kira Ödemesi', subtitle: 'Ev sahibime düzenli kira ödemek istiyorum' },
  { id: 'dues', icon: '🏢', title: 'Aidat Ödemesi', subtitle: 'Apartman veya site yönetimine aidat ödemek istiyorum' },
  { id: 'bills', icon: '⚡', title: 'Fatura Ödemesi', subtitle: 'Elektrik, su, doğalgaz, internet faturalarımı ödemek istiyorum' },
  { id: 'all', icon: '✨', title: 'Hepsi', subtitle: 'Tüm ev giderlerimi tek yerden yönetmek istiyorum' },
];

export function KYCPurposeScreen({ navigation, route }) {
  const { firstName, lastName, city, tckn, birthDate } = route.params;
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    if (id === 'all') {
      setSelected(selected.includes('all') ? [] : ['all']);
      return;
    }
    const withoutAll = selected.filter(s => s !== 'all');
    if (withoutAll.includes(id)) {
      setSelected(withoutAll.filter(s => s !== id));
    } else {
      setSelected([...withoutAll, id]);
    }
  };

  const isSelected = (id) => selected.includes(id);
  const isValid = selected.length > 0;

  const handleNext = () => {
    navigation.navigate('KYCSummary', {
      firstName, lastName, city, tckn, birthDate,
      purposes: selected,
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* İlerleme */}
        <View style={styles.progressRow}>
          {[1, 2, 3, 4].map(i => (
            <View key={i} style={[styles.progressBar, i <= 3 && styles.progressBarActive]} />
          ))}
        </View>
        <Text style={styles.stepLabel}>Adım 3 / 4</Text>

        <Text style={styles.title}>Kiram'ı ne için{'\n'}kullanacaksınız?</Text>
        <Text style={styles.subtitle}>
          Birden fazla seçebilirsiniz. Bu bilgi deneyiminizi kişiselleştirmek için kullanılır.
        </Text>

        <View style={styles.options}>
          {OPTIONS.map(opt => {
            const active = isSelected(opt.id);
            return (
              <TouchableOpacity
                key={opt.id}
                style={[styles.optionCard, active && styles.optionCardActive]}
                onPress={() => toggle(opt.id)}
                activeOpacity={0.8}
              >
                <View style={styles.optionLeft}>
                  <View style={[styles.optionIcon, active && styles.optionIconActive]}>
                    <Text style={styles.optionIconText}>{opt.icon}</Text>
                  </View>
                  <View style={styles.optionText}>
                    <Text style={[styles.optionTitle, active && { color: colors.accent }]}>
                      {opt.title}
                    </Text>
                    <Text style={styles.optionSubtitle}>{opt.subtitle}</Text>
                  </View>
                </View>
                <View style={[styles.checkbox, active && styles.checkboxActive]}>
                  {active && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Devam" onPress={handleNext} disabled={!isValid} />
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Geri</Text>
        </TouchableOpacity>
      </View>
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
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl, lineHeight: 22 },

  options: { gap: spacing.md },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundElevated,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  optionCardActive: { borderColor: colors.accent, backgroundColor: '#EFF6FF' },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  optionIcon: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  optionIconActive: { backgroundColor: '#DBEAFE' },
  optionIconText: { fontSize: 24 },
  optionText: { flex: 1 },
  optionTitle: { ...typography.label, color: colors.textPrimary, marginBottom: 3 },
  optionSubtitle: { ...typography.caption, color: colors.textSecondary, lineHeight: 16 },

  checkbox: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  checkboxActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  checkmark: { color: colors.textInverse, fontSize: 13, fontWeight: '700' },

  footer: { paddingHorizontal: screenPaddingHorizontal, paddingBottom: 100, paddingTop: spacing.md, gap: spacing.sm },
  backBtn: { alignItems: 'center', paddingVertical: spacing.sm },
  backText: { ...typography.label, color: colors.textSecondary },
});
