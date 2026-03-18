import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Modal, Switch, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

const MOCK_RECIPIENTS = [
  { id: '1', name: 'Apartman Yönetimi', iban: 'TR33 0006 1005 1978 6457 8413 26' },
  { id: '2', name: 'Ev Sahibi', iban: 'TR52 0001 0017 4523 1850 3000 01' },
  { id: '3', name: 'Site Yönetimi', iban: 'TR62 0013 4000 0147 4012 8100 09' },
];

const PERIODS = [
  { id: 'monthly', label: 'Aylık' },
  { id: 'weekly', label: 'Haftalık' },
];

const DAYS = Array.from({ length: 28 }, (_, i) => i + 1);

const MOCK_ORDERS = [
  { id: 'ao1', recipient: 'Apartman Yönetimi', amount: 2500, period: 'Aylık', day: 5, active: true },
  { id: 'ao2', recipient: 'Ev Sahibi', amount: 8000, period: 'Aylık', day: 1, active: false },
];

function formatIban(text) {
  const clean = text.replace(/\s/g, '').toUpperCase();
  return (clean.match(/.{1,4}/g) || []).join(' ');
}

export function AutoPaymentScreen({ navigation }) {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [showForm, setShowForm] = useState(false);

  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [showRecipients, setShowRecipients] = useState(false);
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('monthly');
  const [day, setDay] = useState(1);
  const [showDayPicker, setShowDayPicker] = useState(false);

  const toggleOrder = (id) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, active: !o.active } : o));
  };

  const deleteOrder = (id) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const handleSave = () => {
    const recipient = MOCK_RECIPIENTS.find(r => r.id === selectedRecipient);
    if (!recipient || !amount) return;
    setOrders(prev => [...prev, {
      id: 'ao' + Date.now(),
      recipient: recipient.name,
      amount: parseFloat(amount.replace(',', '.')),
      period: PERIODS.find(p => p.id === period)?.label || 'Aylık',
      day,
      active: true,
    }]);
    setShowForm(false);
    setSelectedRecipient(null);
    setAmount('');
    setPeriod('monthly');
    setDay(1);
  };

  const isFormValid = !!selectedRecipient && parseFloat(amount.replace(',', '.')) > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Otomatik Çekim</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(true)}>
          <Text style={styles.addBtnText}>+ Yeni</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {orders.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔁</Text>
            <Text style={styles.emptyTitle}>Otomatik çekim talimatı yok</Text>
            <Text style={styles.emptySub}>Kira, aidat gibi düzenli ödemelerinizi otomatikleştirin.</Text>
          </View>
        )}

        {orders.map(order => (
          <View key={order.id} style={[styles.orderCard, !order.active && styles.orderCardInactive]}>
            <View style={styles.orderTop}>
              <View style={styles.orderIcon}>
                <Text style={{ fontSize: 20 }}>🔁</Text>
              </View>
              <View style={styles.orderInfo}>
                <Text style={styles.orderName}>{order.recipient}</Text>
                <Text style={styles.orderDetail}>
                  Her ay {order.day}. gün · ₺{order.amount.toLocaleString('tr-TR')}
                </Text>
                <View style={[styles.periodBadge, !order.active && { backgroundColor: colors.surface }]}>
                  <Text style={[styles.periodText, !order.active && { color: colors.textTertiary }]}>
                    {order.period}
                  </Text>
                </View>
              </View>
              <Switch
                value={order.active}
                onValueChange={() => toggleOrder(order.id)}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={colors.textInverse}
              />
            </View>
            <View style={styles.orderActions}>
              <TouchableOpacity style={styles.deleteOrderBtn} onPress={() => deleteOrder(order.id)}>
                <Text style={styles.deleteOrderText}>Talimatı Sil</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.apiNote}>
          <Text style={styles.apiNoteText}>
            ℹ Otomatik tahsilat PCI-DSS uyumlu kart saklama servisi (Sipay vb.) ve cron-job altyapısı entegre edildiğinde aktif olacaktır.
          </Text>
        </View>
      </ScrollView>

      {/* Yeni talimat modal */}
      <Modal visible={showForm} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Yeni Otomatik Çekim</Text>

            {/* Alıcı */}
            <Text style={styles.fieldLabel}>Alıcı</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setShowRecipients(!showRecipients)}
            >
              <Text style={[styles.selectorText, !selectedRecipient && { color: colors.textTertiary }]}>
                {MOCK_RECIPIENTS.find(r => r.id === selectedRecipient)?.name || 'Kayıtlı alıcı seçin'}
              </Text>
              <Text style={styles.selectorChevron}>{showRecipients ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {showRecipients && (
              <View style={styles.dropdownList}>
                {MOCK_RECIPIENTS.map(r => (
                  <TouchableOpacity
                    key={r.id}
                    style={styles.dropdownItem}
                    onPress={() => { setSelectedRecipient(r.id); setShowRecipients(false); }}
                  >
                    <Text style={[styles.dropdownText, selectedRecipient === r.id && { color: colors.accent }]}>
                      {r.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Tutar */}
            <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>Tutar (₺)</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={t => setAmount(t.replace(/[^0-9,]/g, ''))}
              placeholder="0,00"
              placeholderTextColor={colors.textTertiary}
              keyboardType="decimal-pad"
            />

            {/* Periyot */}
            <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>Periyot</Text>
            <View style={styles.periodRow}>
              {PERIODS.map(p => (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.periodBtn, period === p.id && styles.periodBtnActive]}
                  onPress={() => setPeriod(p.id)}
                >
                  <Text style={[styles.periodBtnText, period === p.id && styles.periodBtnTextActive]}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Gün */}
            <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>Çekim Günü</Text>
            <TouchableOpacity style={styles.selector} onPress={() => setShowDayPicker(!showDayPicker)}>
              <Text style={styles.selectorText}>Her ayın {day}. günü</Text>
              <Text style={styles.selectorChevron}>{showDayPicker ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {showDayPicker && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.xs }}>
                <View style={{ flexDirection: 'row', gap: spacing.xs, paddingVertical: spacing.xs }}>
                  {DAYS.map(d => (
                    <TouchableOpacity
                      key={d}
                      style={[styles.dayBtn, day === d && styles.dayBtnActive]}
                      onPress={() => { setDay(d); setShowDayPicker(false); }}
                    >
                      <Text style={[styles.dayBtnText, day === d && styles.dayBtnTextActive]}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}

            <View style={styles.modalActions}>
              <Button title="Talimat Oluştur" onPress={handleSave} disabled={!isFormValid} />
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowForm(false)}>
                <Text style={styles.modalCancelText}>Vazgeç</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: screenPaddingHorizontal, paddingVertical: spacing.md,
  },
  back: { padding: 4, marginRight: spacing.md },
  backArrow: { fontSize: 24, color: colors.textPrimary },
  title: { ...typography.h2, color: colors.textPrimary, flex: 1 },
  addBtn: { backgroundColor: colors.accent, borderRadius: 20, paddingVertical: spacing.xs, paddingHorizontal: spacing.md },
  addBtnText: { ...typography.label, color: colors.textInverse },

  list: { paddingHorizontal: screenPaddingHorizontal, paddingBottom: 130, gap: spacing.md },

  empty: { alignItems: 'center', paddingTop: spacing.xxxl, gap: spacing.sm },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { ...typography.h3, color: colors.textSecondary },
  emptySub: { ...typography.body, color: colors.textTertiary, textAlign: 'center' },

  orderCard: {
    backgroundColor: colors.backgroundElevated, borderRadius: 16,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  },
  orderCardInactive: { opacity: 0.6 },
  orderTop: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md },
  orderIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  orderInfo: { flex: 1, gap: 3 },
  orderName: { ...typography.label, color: colors.textPrimary },
  orderDetail: { ...typography.bodySmall, color: colors.textSecondary },
  periodBadge: { backgroundColor: '#EFF6FF', borderRadius: 10, paddingVertical: 2, paddingHorizontal: spacing.sm, alignSelf: 'flex-start', marginTop: 2 },
  periodText: { ...typography.caption, color: colors.accent },
  orderActions: { borderTopWidth: 1, borderTopColor: colors.borderLight, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  deleteOrderBtn: {},
  deleteOrderText: { ...typography.caption, color: colors.error },

  apiNote: { backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md },
  apiNoteText: { ...typography.caption, color: colors.textTertiary, lineHeight: 18 },

  /* Modal */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: colors.backgroundElevated, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: screenPaddingHorizontal, paddingBottom: 44, maxHeight: '90%',
  },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginTop: spacing.md, marginBottom: spacing.lg },
  modalTitle: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.lg },
  fieldLabel: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.xs },
  selector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border, padding: spacing.md },
  selectorText: { ...typography.body, color: colors.textPrimary },
  selectorChevron: { color: colors.textTertiary, fontSize: 12 },
  dropdownList: { backgroundColor: colors.backgroundElevated, borderRadius: 12, borderWidth: 1, borderColor: colors.border, marginTop: spacing.xs, overflow: 'hidden' },
  dropdownItem: { padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  dropdownText: { ...typography.body, color: colors.textPrimary },
  input: { backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border, padding: spacing.md, ...typography.bodyLarge, color: colors.textPrimary },
  periodRow: { flexDirection: 'row', gap: spacing.sm },
  periodBtn: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  periodBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  periodBtnText: { ...typography.label, color: colors.textSecondary },
  periodBtnTextActive: { color: colors.textInverse },
  dayBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  dayBtnActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  dayBtnText: { ...typography.label, color: colors.textSecondary },
  dayBtnTextActive: { color: colors.textInverse },
  modalActions: { marginTop: spacing.xl, gap: spacing.sm },
  modalCancelBtn: { alignItems: 'center', paddingVertical: spacing.sm },
  modalCancelText: { ...typography.label, color: colors.textSecondary },
});
