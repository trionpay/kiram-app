import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '../theme';

export function Skeleton({ width = '100%', height = 20, borderRadius = 8, style }) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View style={[styles.skeleton, { width, height, borderRadius }, style]}>
      <Animated.View
        style={[
          styles.shimmer,
          { transform: [{ translateX }] },
        ]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.15)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

export function SkeletonText({ width = '100%', lines = 1, lineHeight = 14, gap = 8 }) {
  return (
    <View style={{ gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 && lines > 1 ? '70%' : width}
          height={lineHeight}
          borderRadius={4}
        />
      ))}
    </View>
  );
}

export function SkeletonAvatar({ size = 42 }) {
  return <Skeleton width={size} height={size} borderRadius={size / 2} />;
}

export function SkeletonCard({ height = 120 }) {
  return <Skeleton width="100%" height={height} borderRadius={16} />;
}

export function SkeletonTransactionRow() {
  return (
    <View style={styles.txRow}>
      <Skeleton width={42} height={42} borderRadius={13} />
      <View style={styles.txMid}>
        <Skeleton width="60%" height={14} borderRadius={4} />
        <Skeleton width="40%" height={12} borderRadius={4} style={{ marginTop: 6 }} />
      </View>
      <Skeleton width={70} height={14} borderRadius={4} />
    </View>
  );
}

export function SkeletonRecipientRow() {
  return (
    <View style={styles.recipientRow}>
      <Skeleton width={48} height={48} borderRadius={14} />
      <View style={styles.recipientMid}>
        <Skeleton width="50%" height={14} borderRadius={4} />
        <Skeleton width="80%" height={12} borderRadius={4} style={{ marginTop: 6 }} />
      </View>
    </View>
  );
}

export function SkeletonBillCompany() {
  return (
    <View style={styles.billCompany}>
      <Skeleton width={44} height={44} borderRadius={12} />
      <Skeleton width="70%" height={14} borderRadius={4} style={{ marginTop: 8 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  shimmer: {
    width: '100%',
    height: '100%',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: spacing.md,
  },
  txMid: {
    flex: 1,
  },
  recipientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.backgroundElevated,
    borderRadius: 16,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  recipientMid: {
    flex: 1,
  },
  billCompany: {
    width: 100,
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.backgroundElevated,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
