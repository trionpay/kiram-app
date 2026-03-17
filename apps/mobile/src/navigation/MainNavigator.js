import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../screens/main/DashboardScreen';
import { PlaceholderScreen } from '../screens/main/PlaceholderScreen';
import { RecipientsScreen } from '../screens/main/RecipientsScreen';
import { PaymentNavigator } from './PaymentNavigator';
import { FloatingTabBar } from '../components/FloatingTabBar';

const Tab = createBottomTabNavigator();

export function MainNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Recipients" component={RecipientsScreen} />
      <Tab.Screen name="Payment" component={PaymentNavigator} />
      <Tab.Screen name="History">
        {() => <PlaceholderScreen title="İşlem Geçmişi" subtitle="İşlem listesi yakında eklenecek." />}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {() => <PlaceholderScreen title="Profil" subtitle="Profil ve ayarlar yakında eklenecek." />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
