import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { OTPScreen } from '../screens/auth/OTPScreen';
import { KYCNameScreen } from '../screens/auth/KYCNameScreen';
import { KYCIdentityScreen } from '../screens/auth/KYCIdentityScreen';
import { KYCPurposeScreen } from '../screens/auth/KYCPurposeScreen';
import { KYCSummaryScreen } from '../screens/auth/KYCSummaryScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { NotificationPermissionScreen } from '../screens/auth/NotificationPermissionScreen';

const Stack = createNativeStackNavigator();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      {/* KYC akışı — yeni kullanıcılar için */}
      <Stack.Screen name="KYCName" component={KYCNameScreen} />
      <Stack.Screen name="KYCIdentity" component={KYCIdentityScreen} />
      <Stack.Screen name="KYCPurpose" component={KYCPurposeScreen} />
      <Stack.Screen name="KYCSummary" component={KYCSummaryScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="NotificationPermission" component={NotificationPermissionScreen} />
    </Stack.Navigator>
  );
}
