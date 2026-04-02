import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../screens/main/DashboardScreen';
import { PlaceholderScreen } from '../screens/main/PlaceholderScreen';
import { RecipientsScreen } from '../screens/main/RecipientsScreen';
import { HistoryScreen } from '../screens/main/HistoryScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { PaymentNavigator } from './PaymentNavigator';
import { FloatingTabBar } from '../components/FloatingTabBar';

const Tab = createBottomTabNavigator();

export function MainNavigator({ route }) {
  const firstName = route?.params?.firstName;
  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} initialParams={{ firstName }} />
      <Tab.Screen name="Recipients" component={RecipientsScreen} />
      <Tab.Screen name="Payment" component={PaymentNavigator} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
