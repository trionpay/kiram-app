import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

const FEATURES = [
  { icon: '✅', text: 'Ödeme başarılı olduğunda anında bildirim' },
  { icon: '❌', text: 'Başarısız işlemlerde hızlı uyarı' },
  { icon: '🔁', text: 'Otomatik çekim talimatı hatırlatmaları' },
];

/**
 * Push bildirim izin ekranı (Blueprint §9-S1).
 * expo-notifications API bağlandığında gerçek izin isteği yapılacak.
 * Şimdilik UX ekranı — kullanıcı "İzin Ver" veya "Şimdi Değil" seçer.
 */
export function NotificationPermissionScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const handleAllow = async () => {
    setLoading(true);
    // API gelince: await Notifications.requestPermissionsAsync()
    // Şimdilik mock — 1 sn sonra dashboard'a geç
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Main');
    }, 800);
  };

  const handleSkip = () => {
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* İkon */}
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>🔔</Text>
          </View>

          <Text style={styles.title}>Bildirimler</Text>
          <Text style={styles.subtitle}>
            Ödeme durumlarınızdan anında haberdar olmak için bildirimlere izin verin.
          </Text>

          {/* Özellikler */}
          <View style={styles.featureList}>
            {FEATURES.map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
                <Text style={styles.featureText}>{f.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Button title="Bildirimlere İzin Ver" onPress={handleAllow} loading={loading} />
          <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
            <Text style={styles.skipText}>Şimdi Değil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: screenPaddingHorizontal },

  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  iconCircle: {
    width: 88, height: 88, borderRadius: 28,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  iconText: { fontSize: 42 },
  title: { ...typography.h1, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: spacing.xxl },

  featureList: { width: '100%', gap: spacing.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  featureIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  featureText: { ...typography.body, color: colors.textPrimary, flex: 1 },

  footer: { paddingBottom: spacing.xl, gap: spacing.sm },
  skipBtn: { alignItems: 'center', paddingVertical: spacing.sm },
  skipText: { ...typography.label, color: colors.textSecondary },
});
