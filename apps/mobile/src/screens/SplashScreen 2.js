import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/Button';
import { colors, typography, spacing } from '../theme';

/**
 * Kiram — Açılış ekranı (Blueprint S1).
 * Marka güveni, kurumsal kimlik. 2.5 sn sonra otomatik geçiş veya "Devam" ile.
 */
export function SplashScreen({ navigation }) {
  const autoAdvance = useRef(null);

  useEffect(() => {
    autoAdvance.current = setTimeout(() => {
      navigation.replace('Login');
    }, 2500);
    return () => {
      if (autoAdvance.current) clearTimeout(autoAdvance.current);
    };
  }, [navigation]);

  const handlePress = () => {
    if (autoAdvance.current) {
      clearTimeout(autoAdvance.current);
      autoAdvance.current = null;
    }
    navigation.replace('Login');
  };

  return (
    <View style={styles.fullScreen}>
      <View style={styles.content}>
        {/* Logo / marka alanı */}
        <View style={styles.brandBlock}>
          <View style={styles.accentLine} />
          <Text style={styles.logo}>Kiram</Text>
          <Text style={styles.tagline}>
            Ödemeleriniz güvende, deneyim sizinle.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Devam"
          onPress={handlePress}
          variant="primary"
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  brandBlock: {
    alignSelf: 'flex-start',
  },
  accentLine: {
    width: 40,
    height: 4,
    backgroundColor: colors.accent,
    borderRadius: 2,
    marginBottom: spacing.lg,
  },
  logo: {
    ...typography.hero,
    color: colors.textInverse,
    fontSize: 36,
  },
  tagline: {
    ...typography.bodyLarge,
    color: colors.textTertiary,
    marginTop: spacing.sm,
    opacity: 0.9,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  button: {
    backgroundColor: colors.accent,
  },
});
