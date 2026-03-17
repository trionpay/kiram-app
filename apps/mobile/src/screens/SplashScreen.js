import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Button } from '../components/Button';
import { TrionPayLogo } from '../components/TrionPayLogo';
import { colors, typography, spacing } from '../theme';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export function SplashScreen({ navigation }) {
  const timer = useRef(null);

  useEffect(() => {
    timer.current = setTimeout(() => navigation.replace('Login'), 3000);
    return () => clearTimeout(timer.current);
  }, [navigation]);

  const handlePress = () => {
    clearTimeout(timer.current);
    navigation.replace('Login');
  };

  return (
    <View style={styles.screen}>
      {/* Arka plan dekoratif şekiller */}
      <View style={styles.circleTopRight} />
      <View style={styles.circleBottomLeft} />

      {/* İçerik */}
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoWrapper}>
          <TrionPayLogo width={SCREEN_W * 0.48} color="#FFFFFF" accentColor="#5FE00B" />
        </View>

        {/* Alt bilgi */}
        <View style={styles.infoBlock}>
          <View style={styles.dividerLine} />
          <Text style={styles.tagline}>
            Ödemeleriniz güvende,{'\n'}deneyim sizinle.
          </Text>
        </View>
      </View>

      {/* Alt buton */}
      <View style={styles.footer}>
        <Button
          title="Başlayın"
          onPress={handlePress}
          style={styles.btn}
          textStyle={styles.btnText}
        />
        <Text style={styles.version}>kiram.com</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.primary,
  },

  /* Dekoratif daireler */
  circleTopRight: {
    position: 'absolute',
    width: SCREEN_W * 0.9,
    height: SCREEN_W * 0.9,
    borderRadius: SCREEN_W * 0.45,
    backgroundColor: colors.primaryLight,
    opacity: 0.25,
    top: -SCREEN_W * 0.35,
    right: -SCREEN_W * 0.2,
  },
  circleBottomLeft: {
    position: 'absolute',
    width: SCREEN_W * 0.7,
    height: SCREEN_W * 0.7,
    borderRadius: SCREEN_W * 0.35,
    borderWidth: 1,
    borderColor: colors.accent,
    opacity: 0.12,
    bottom: SCREEN_H * 0.12,
    left: -SCREEN_W * 0.3,
  },

  /* İçerik */
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoWrapper: {
    marginBottom: spacing.xxl,
  },
  infoBlock: {
    gap: spacing.md,
  },
  dividerLine: {
    width: 36,
    height: 2,
    backgroundColor: colors.accent,
    borderRadius: 1,
  },
  tagline: {
    ...typography.bodyLarge,
    color: colors.textTertiary,
    lineHeight: 26,
    opacity: 0.85,
  },

  /* Footer */
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 52,
    gap: spacing.md,
    alignItems: 'center',
  },
  btn: {
    backgroundColor: colors.accent,
    width: '100%',
    borderRadius: 16,
    height: 56,
  },
  btnText: {
    fontSize: 17,
    fontWeight: '600',
  },
  version: {
    ...typography.caption,
    color: colors.textTertiary,
    opacity: 0.5,
    letterSpacing: 1,
  },
});
