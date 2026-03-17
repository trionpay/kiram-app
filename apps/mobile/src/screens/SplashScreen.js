import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../components/Button';
import { colors, typography, spacing } from '../theme';

export function SplashScreen({ navigation }) {
  const timer = useRef(null);

  useEffect(() => {
    timer.current = setTimeout(() => navigation.replace('Login'), 2500);
    return () => clearTimeout(timer.current);
  }, [navigation]);

  const handlePress = () => {
    clearTimeout(timer.current);
    navigation.replace('Login');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.accentLine} />
        <Text style={styles.logo}>Kiram</Text>
        <Text style={styles.tagline}>Ödemeleriniz güvende,{'\n'}deneyim sizinle.</Text>
      </View>
      <View style={styles.footer}>
        <Button title="Devam" onPress={handlePress} style={styles.btn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.primary },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 32 },
  accentLine: { width: 40, height: 4, backgroundColor: colors.accent, borderRadius: 2, marginBottom: spacing.lg },
  logo: { ...typography.hero, fontSize: 40, color: colors.textInverse },
  tagline: { ...typography.bodyLarge, color: colors.textTertiary, marginTop: spacing.sm, opacity: 0.9 },
  footer: { paddingHorizontal: 32, paddingBottom: 56 },
  btn: { backgroundColor: colors.accent },
});
