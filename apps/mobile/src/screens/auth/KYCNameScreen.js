import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
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

export function KYCNameScreen({ navigation, route }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [city, setCity] = useState('');
  const [showCities, setShowCities] = useState(false);

  const isValid = firstName.trim().length > 1 && lastName.trim().length > 1 && city.length > 0;

  const handleNext = () => {
    navigation.navigate('KYCIdentity', { firstName, lastName, city });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* İlerleme */}
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

          {/* Ad */}
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
            />
          </View>

          {/* Soyad */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Soyad</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Soyadınız"
              placeholderTextColor={colors.textTertiary}
              autoCapitalize="words"
            />
          </View>

          {/* Şehir */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Şehir</Text>
            <TouchableOpacity
              style={styles.citySelector}
              onPress={() => setShowCities(!showCities)}
            >
              <Text style={[styles.citySelectorText, !city && { color: colors.textTertiary }]}>
                {city || 'Yaşadığınız şehri seçin'}
              </Text>
              <Text style={styles.chevron}>{showCities ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {showCities && (
              <View style={styles.cityList}>
                <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} style={{ maxHeight: 220 }}>
                  {CITIES.map(c => (
                    <TouchableOpacity
                      key={c}
                      style={[styles.cityItem, city === c && styles.cityItemActive]}
                      onPress={() => { setCity(c); setShowCities(false); }}
                    >
                      <Text style={[styles.cityItemText, city === c && styles.cityItemTextActive]}>
                        {c}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button title="Devam" onPress={handleNext} disabled={!isValid} />
        </View>
      </KeyboardAvoidingView>
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
  citySelectorText: { ...typography.bodyLarge, color: colors.textPrimary },
  chevron: { color: colors.textTertiary, fontSize: 12 },

  cityList: {
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  cityItem: { padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  cityItemActive: { backgroundColor: '#EFF6FF' },
  cityItemText: { ...typography.body, color: colors.textPrimary },
  cityItemTextActive: { color: colors.accent, fontFamily: 'DMSans_600SemiBold' },

  footer: { paddingHorizontal: screenPaddingHorizontal, paddingBottom: 100, paddingTop: spacing.md },
});
