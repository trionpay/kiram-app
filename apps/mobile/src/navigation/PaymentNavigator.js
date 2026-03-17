import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaymentAmountScreen } from '../screens/payment/PaymentAmountScreen';
import { PaymentSummaryScreen } from '../screens/payment/PaymentSummaryScreen';
import { CardInputScreen } from '../screens/payment/CardInputScreen';
import { ThreeDSecureScreen } from '../screens/payment/ThreeDSecureScreen';
import { PaymentResultScreen } from '../screens/payment/PaymentResultScreen';

const Stack = createNativeStackNavigator();

export function PaymentNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PaymentAmount" component={PaymentAmountScreen} />
      <Stack.Screen name="PaymentSummary" component={PaymentSummaryScreen} />
      <Stack.Screen name="CardInput" component={CardInputScreen} />
      <Stack.Screen name="ThreeDSecure" component={ThreeDSecureScreen} />
      <Stack.Screen name="PaymentResult" component={PaymentResultScreen} />
    </Stack.Navigator>
  );
}
