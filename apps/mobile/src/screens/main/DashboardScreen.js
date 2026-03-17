import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { TrionPayLogo } from '../../components/TrionPayLogo';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

const MOCK_TXS = [
  { id: '1', name: 'Apartman Yönetimi', amount: '2.500,00', status: 'success', date: 'Bugün, 10:32' },
  { id: '2', name: 'Elektrik Faturası', amount: '480,00', status: 'success', date: 'Dün, 14:15' },
  { id: '3', name: 'Kira Ödemesi', amount: '12.000,00', status: 'failed', date: '15 Mar' },
];

export function DashboardScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.greeting}>Merhaba 👋</Text>
            <Text style={styles.name}>Kullanıcı</Text>
          </View>
          <View style={styles.avatar}><Text style={styles.avatarTxt}>K</Text></View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <TrionPayLogo width={100} color="#FFFFFF" accentColor="#5FE00B" />
          </View>
          <Text style={styles.heroLabel}>Yeni ödeme</Text>
          <Text style={styles.heroTitle}>Hızlı ve güvenli{'\n'}para transferi</Text>
          <Button title="Ödeme Başlat" onPress={() => navigation.navigate('Payment')} style={styles.heroBtn} />
        </View>

        <View style={styles.quickRow}>
          {[{ icon: '↗', label: 'Gönder' }, { icon: '📋', label: 'Alıcılar' }, { icon: '🗂', label: 'Geçmiş' }, { icon: '⚡', label: 'Fatura' }].map(item => (
            <TouchableOpacity key={item.label} style={styles.quickItem}>
              <View style={styles.quickIcon}><Text style={{ fontSize: 20 }}>{item.icon}</Text></View>
              <Text style={styles.quickLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Son İşlemler</Text>
          <TouchableOpacity><Text style={styles.seeAll}>Tümü</Text></TouchableOpacity>
        </View>

        {MOCK_TXS.map(tx => (
          <TouchableOpacity key={tx.id} style={styles.txRow}>
            <View style={styles.txLeft}>
              <View style={styles.txIcon}><Text style={{ fontSize: 16 }}>{tx.status === 'success' ? '↗' : '✕'}</Text></View>
              <View>
                <Text style={styles.txName}>{tx.name}</Text>
                <Text style={styles.txDate}>{tx.date}</Text>
              </View>
            </View>
            <View style={styles.txRight}>
              <Text style={[styles.txAmount, tx.status === 'failed' && { color: colors.error }]}>₺{tx.amount}</Text>
              <View style={[styles.dot, { backgroundColor: tx.status === 'success' ? colors.success : colors.error }]} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: screenPaddingHorizontal, paddingTop: spacing.md, paddingBottom: 130 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
  greeting: { ...typography.bodySmall, color: colors.textSecondary },
  name: { ...typography.h3, color: colors.textPrimary },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { ...typography.label, color: colors.textInverse },
  heroCard: { backgroundColor: colors.primary, borderRadius: 20, padding: spacing.xl, marginBottom: spacing.xl },
  heroTop: { marginBottom: spacing.lg },
  heroLabel: { ...typography.caption, color: colors.accent, marginBottom: spacing.xs },
  heroTitle: { ...typography.h2, color: colors.textInverse, marginBottom: spacing.xl },
  heroBtn: { alignSelf: 'flex-start', paddingHorizontal: spacing.xl },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xl },
  quickItem: { alignItems: 'center', gap: spacing.xs },
  quickIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: colors.backgroundElevated, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { ...typography.caption, color: colors.textSecondary },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  sectionTitle: { ...typography.h3, color: colors.textPrimary },
  seeAll: { ...typography.label, color: colors.accent },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.backgroundElevated, borderRadius: 14, padding: spacing.md, borderWidth: 1, borderColor: colors.borderLight, marginBottom: spacing.xs },
  txLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  txIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  txName: { ...typography.label, color: colors.textPrimary },
  txDate: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  txRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  txAmount: { ...typography.label, color: colors.textPrimary },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
