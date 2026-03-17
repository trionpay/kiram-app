import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaymentTypeScreen } from '../screens/payment/PaymentTypeScreen';
import { PaymentAmountScreen } from '../screens/payment/PaymentAmountScreen';
import { BillPaymentScreen } from '../screens/payment/BillPaymentScreen';
import { PaymentSummaryScreen } from '../screens/payment/PaymentSummaryScreen';
import { CardInputScreen } from '../screens/payment/CardInputScreen';
import { ThreeDSecureScreen } from '../screens/payment/ThreeDSecureScreen';
import { PaymentResultScreen } from '../screens/payment/PaymentResultScreen';

const Stack = createNativeStackNavigator();

export function PaymentNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Tip seçimi — ilk ekran */}
      <Stack.Screen name="PaymentType" component={PaymentTypeScreen} />
      {/* Kira & Aidat akışı */}
      <Stack.Screen name="PaymentAmount" component={PaymentAmountScreen} />
      {/* Fatura ödeme akışı */}
      <Stack.Screen name="BillPayment" component={BillPaymentScreen} />
      {/* Ortak son adımlar */}
      <Stack.Screen name="PaymentSummary" component={PaymentSummaryScreen} />
      <Stack.Screen name="CardInput" component={CardInputScreen} />
      <Stack.Screen name="ThreeDSecure" component={ThreeDSecureScreen} />
      <Stack.Screen name="PaymentResult" component={PaymentResultScreen} />
    </Stack.Navigator>
  );
}
