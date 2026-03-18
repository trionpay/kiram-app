import React, { useRef } from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { colors, typography, spacing } from '../theme';

const variants = {
  primary: { backgroundColor: colors.accent, textColor: colors.textInverse },
  secondary: { backgroundColor: colors.surface, textColor: colors.primary },
  outline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.primary, textColor: colors.primary },
};

export function Button({ title, onPress, variant = 'primary', disabled = false, loading = false, style, textStyle }) {
  const config = variants[variant] || variants.primary;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      friction: 5,
      tension: 300,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
    >
      <Animated.View
        style={[
          styles.base,
          {
            backgroundColor: config.backgroundColor,
            borderWidth: config.borderWidth || 0,
            borderColor: config.borderColor,
            opacity: disabled ? 0.5 : 1,
            transform: [{ scale: scaleAnim }],
          },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={config.textColor} size="small" />
        ) : (
          <Text style={[styles.text, { color: config.textColor }, textStyle]}>{title}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  text: { ...typography.label, fontSize: 16 },
});
