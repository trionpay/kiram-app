import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors, typography, spacing } from '../theme';

const variants = {
  primary: {
    backgroundColor: colors.accent,
    textColor: colors.textInverse,
  },
  secondary: {
    backgroundColor: colors.surface,
    textColor: colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    textColor: colors.primary,
  },
};

/**
 * Birincil aksiyonlar: primary (teal dolu).
 * İkincil: secondary veya outline.
 */
export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) {
  const config = variants[variant] || variants.primary;
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        {
          backgroundColor: config.backgroundColor,
          borderWidth: isOutline ? 2 : 0,
          borderColor: config.borderColor,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={config.textColor} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            { color: config.textColor },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  text: {
    ...typography.label,
    fontSize: 16,
  },
});
