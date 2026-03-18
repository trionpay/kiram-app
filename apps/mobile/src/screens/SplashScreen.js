import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { Button } from '../components/Button';
import { TrionPayLogo } from '../components/TrionPayLogo';
import { colors, typography, spacing } from '../theme';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export function SplashScreen({ navigation }) {
  const timer = useRef(null);

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(20)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;
  const circleScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
      ]),
      Animated.delay(150),
      Animated.parallel([
        Animated.timing(taglineOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(taglineTranslateY, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      Animated.delay(100),
      Animated.timing(footerOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(circleScale, { toValue: 1.05, duration: 2000, useNativeDriver: true }),
        Animated.timing(circleScale, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    timer.current = setTimeout(() => navigation.replace('Login'), 3500);
    return () => clearTimeout(timer.current);
  }, [navigation, logoOpacity, logoScale, taglineOpacity, taglineTranslateY, footerOpacity, circleScale]);

  const handlePress = () => {
    clearTimeout(timer.current);
    navigation.replace('Login');
  };

  return (
    <View style={styles.screen}>
      {/* Arka plan dekoratif şekiller */}
      <Animated.View style={[styles.circleTopRight, { transform: [{ scale: circleScale }] }]} />
      <Animated.View style={[styles.circleBottomLeft, { transform: [{ scale: circleScale }] }]} />

      {/* İçerik */}
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View style={[styles.logoWrapper, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
          <TrionPayLogo width={SCREEN_W * 0.48} color="#FFFFFF" accentColor="#5FE00B" />
        </Animated.View>

        {/* Alt bilgi */}
        <Animated.View style={[styles.infoBlock, { opacity: taglineOpacity, transform: [{ translateY: taglineTranslateY }] }]}>
          <View style={styles.dividerLine} />
          <Text style={styles.tagline}>
            Ödemeleriniz güvende,{'\n'}deneyim sizinle.
          </Text>
        </Animated.View>
      </View>

      {/* Alt buton */}
      <Animated.View style={[styles.footer, { opacity: footerOpacity }]}>
        <Button
          title="Başlayın"
          onPress={handlePress}
          style={styles.btn}
          textStyle={styles.btnText}
        />
        <Text style={styles.version}>kiram.com</Text>
      </Animated.View>
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
