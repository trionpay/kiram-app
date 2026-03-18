import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

const CITIES = [
  'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya',
  'Adana', 'Konya', 'Gaziantep', 'Mersin', 'Kocaeli',
  'Diyarbakır', 'Hatay', 'Manisa', 'Kayseri', 'Samsun',
  'Trabzon', 'Eskişehir', 'Denizli', 'Sakarya', 'Diğer',
];

export function KYCNameScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [city, setCity] = useState('');
  const [cityModalVisible, setCityModalVisible] = useState(false);

  const isValid = firstName.trim().length > 1 && lastName.trim().length > 1 && city.length > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.progressRow}>
            {[1, 2, 3, 4].map(i => (
              <View key={i} style={[styles.progressBar, i <= 1 && styles.progressBarActive]} />
            ))}
          </View>
          <Text style={styles.stepLabel}>Adım 1 / 4</Text>

          <Text style={styles.title}>Sizi tanıyalım</Text>
          <Text style={styles.subtitle}>
            Kimlik bilgileriniz güvenli şekilde saklanır ve üçüncü taraflarla paylaşılmaz.
          </Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Ad</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Adınız"
              placeholderTextColor={colors.textTertiary}
              autoCapitalize="words"
              autoFocus
              returnKeyType="next"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Soyad</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Soyadınız"
              placeholderTextColor={colors.textTertiary}
              autoCapitalize="words"
              returnKeyType="done"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Şehir</Text>
            <TouchableOpacity
              style={[styles.citySelector, city && styles.citySelectorFilled]}
              onPress={() => setCityModalVisible(true)}
            >
              <Text style={[styles.citySelectorText, !city && { color: colors.textTertiary }]}>
                {city || 'Yaşadığınız şehri seçin'}
              </Text>
              <Text style={styles.chevron}>▼</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button title="Devam" onPress={() => navigation.navigate('KYCIdentity', { firstName, lastName, city })} disabled={!isValid} />
        </View>
      </KeyboardAvoidingView>

      {/* Şehir seçici modal — klavye/buton sorunlarından bağımsız */}
      <Modal visible={cityModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Şehir Seçin</Text>
              <TouchableOpacity onPress={() => setCityModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.cityScroll}>
              {CITIES.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[styles.cityItem, city === c && styles.cityItemActive]}
                  onPress={() => { setCity(c); setCityModalVisible(false); }}
                >
                  <Text style={[styles.cityItemText, city === c && styles.cityItemTextActive]}>
                    {c}
                  </Text>
                  {city === c && <Text style={styles.cityCheck}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: screenPaddingHorizontal,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },

  progressRow: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.xs },
  progressBar: { flex: 1, height: 3, borderRadius: 2, backgroundColor: colors.border },
  progressBarActive: { backgroundColor: colors.accent },
  stepLabel: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.xl },

  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl, lineHeight: 22 },

  field: { marginBottom: spacing.lg },
  fieldLabel: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.xs },
  input: {
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    padding: spacing.md,
    ...typography.bodyLarge,
    color: colors.textPrimary,
  },
  citySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    padding: spacing.md,
  },
  citySelectorFilled: { borderColor: colors.accent },
  citySelectorText: { ...typography.bodyLarge, color: colors.textPrimary },
  chevron: { color: colors.textTertiary, fontSize: 12 },

  footer: {
    paddingHorizontal: screenPaddingHorizontal,
    paddingTop: spacing.sm,
    paddingBottom: 0,
  },

  /* Modal */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: screenPaddingHorizontal,
    paddingBottom: 40,
    maxHeight: '75%',
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: { ...typography.h3, color: colors.textPrimary },
  modalClose: { fontSize: 20, color: colors.textSecondary, padding: spacing.xs },
  cityScroll: { flexGrow: 0 },
  cityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  cityItemActive: {},
  cityItemText: { ...typography.body, color: colors.textPrimary },
  cityItemTextActive: { color: colors.accent, fontFamily: 'DMSans_600SemiBold' },
  cityCheck: { color: colors.accent, fontSize: 16, fontWeight: '700' },
});
