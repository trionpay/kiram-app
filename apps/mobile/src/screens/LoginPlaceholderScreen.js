import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors, typography } from '../theme';

/**
 * Giriş ekranı placeholder — Adım 3'te telefon + OTP ile doldurulacak.
 */
export function LoginPlaceholderScreen() {
  return (
    <ScreenContainer>
      <View style={styles.center}>
        <Text style={styles.title}>Giriş</Text>
        <Text style={styles.subtitle}>
          Telefon numarası ve OTP ekranları Adım 3'te eklenecek.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});
