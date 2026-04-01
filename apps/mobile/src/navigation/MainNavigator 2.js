import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../screens/main/DashboardScreen';
import { PlaceholderScreen } from '../screens/main/PlaceholderScreen';
import { colors, typography } from '../theme';

const Tab = createBottomTabNavigator();

const TabIcon = ({ icon, focused }) => (
  <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>{icon}</Text>
);

export function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.backgroundElevated,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          ...typography.caption,
          fontSize: 11,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Genel bakış',
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Payment"
        options={{
          tabBarLabel: 'Ödeme',
          tabBarIcon: ({ focused }) => <TabIcon icon="↗" focused={focused} />,
        }}
      >
        {() => <PlaceholderScreen title="Ödeme" subtitle="Ödeme akışı Adım 5'te eklenecek." />}
      </Tab.Screen>
      <Tab.Screen
        name="Recipients"
        options={{
          tabBarLabel: 'Alıcılar',
          tabBarIcon: ({ focused }) => <TabIcon icon="👥" focused={focused} />,
        }}
      >
        {() => <PlaceholderScreen title="Alıcılar" subtitle="Alıcı yönetimi Adım 6'da eklenecek." />}
      </Tab.Screen>
      <Tab.Screen
        name="History"
        options={{
          tabBarLabel: 'Geçmiş',
          tabBarIcon: ({ focused }) => <TabIcon icon="🗂" focused={focused} />,
        }}
      >
        {() => <PlaceholderScreen title="İşlem Geçmişi" subtitle="İşlem listesi Adım 7'de eklenecek." />}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ focused }) => <TabIcon icon="👤" focused={focused} />,
        }}
      >
        {() => <PlaceholderScreen title="Profil" subtitle="Profil ve ayarlar Adım 8'de eklenecek." />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
