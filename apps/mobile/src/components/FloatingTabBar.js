import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

const TABS = [
  { name: 'Dashboard', icon: '⊞', label: 'Ana Sayfa' },
  { name: 'Recipients', icon: '◎', label: 'Alıcılar' },
  { name: 'Payment', icon: null, label: 'Ödeme' }, // orta buton
  { name: 'History', icon: '↻', label: 'Geçmiş' },
  { name: 'Profile', icon: '◉', label: 'Profil' },
];

export function FloatingTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 12);

  // Ödeme/nested stack içindeyse navbar'ı gizle
  const activeRoute = state.routes[state.index];
  const nestedState = activeRoute.state;
  if (nestedState && nestedState.index > 0) return null;

  return (
    <View style={[styles.wrapper, { paddingBottom: bottomPad }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const tab = TABS[index];
          const isFocused = state.index === index;
          const isCenter = index === 2;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (isCenter) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                activeOpacity={0.85}
                style={styles.centerBtnWrapper}
              >
                <View style={styles.centerBtn}>
                  <Text style={styles.centerBtnIcon}>↗</Text>
                </View>
                <Text style={styles.centerLabel}>Ödeme</Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              style={styles.tab}
            >
              <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
                <Text style={[styles.icon, isFocused && styles.iconActive]}>
                  {tab.icon}
                </Text>
              </View>
              <Text style={[styles.label, isFocused && styles.labelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    backgroundColor: 'transparent',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.primary,
    borderRadius: 28,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },

  /* Normal sekme */
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    gap: 3,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: 'rgba(13, 148, 136, 0.15)',
  },
  icon: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.35)',
  },
  iconActive: {
    color: colors.accent,
  },
  label: {
    fontSize: 9,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 0.2,
  },
  labelActive: {
    color: colors.accent,
  },

  /* Orta ödeme butonu */
  centerBtnWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingBottom: 2,
  },
  centerBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -14,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 8,
  },
  centerBtnIcon: {
    fontSize: 19,
    color: colors.textInverse,
    fontWeight: '600',
  },
  centerLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.accent,
    letterSpacing: 0.2,
  },
});
