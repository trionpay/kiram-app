import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

const INITIAL_RECIPIENTS = [
  { id: '1', name: 'Apartman Yönetimi', iban: 'TR33 0006 1005 1978 6457 8413 26', nickname: 'Apartman' },
  { id: '2', name: 'Ev Sahibi', iban: 'TR52 0001 0017 4523 1850 3000 01', nickname: 'Ev Sahibi' },
  { id: '3', name: 'Site Yönetimi', iban: 'TR62 0013 4000 0147 4012 8100 09', nickname: 'Site' },
];

function formatIban(text) {
  const clean = text.replace(/\s/g, '').toUpperCase();
  const parts = clean.match(/.{1,4}/g) || [];
  return parts.join(' ');
}

export function RecipientsScreen({ navigation }) {
  const [recipients, setRecipients] = useState(INITIAL_RECIPIENTS);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState({ name: '', iban: '', nickname: '' });
  const [search, setSearch] = useState('');

  const filtered = recipients.filter(r =>
    r.nickname.toLowerCase().includes(search.toLowerCase()) ||
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.iban.includes(search)
  );

  const openAdd = () => {
    setEditTarget(null);
    setForm({ name: '', iban: '', nickname: '' });
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditTarget(r.id);
    setForm({ name: r.name, iban: r.iban, nickname: r.nickname });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setRecipients(prev => prev.filter(r => r.id !== id));
  };

  const handleSave = () => {
    if (!form.name || form.iban.replace(/\s/g, '').length !== 26) return;
    if (editTarget) {
      setRecipients(prev => prev.map(r =>
        r.id === editTarget ? { ...r, ...form } : r
      ));
    } else {
      setRecipients(prev => [...prev, {
        id: Date.now().toString(),
        name: form.name,
        iban: form.iban,
        nickname: form.nickname || form.name,
      }]);
    }
    setShowModal(false);
  };

  const isFormValid = form.name.length > 1 && form.iban.replace(/\s/g, '').length === 26;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Alıcılar</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addBtnText}>+ Ekle</Text>
        </TouchableOpacity>
      </View>

      {/* Arama */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="İsim veya IBAN ara..."
          placeholderTextColor={colors.textTertiary}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>Alıcı bulunamadı</Text>
            <Text style={styles.emptySubtitle}>Yeni alıcı eklemek için "+ Ekle" butonunu kullanın.</Text>
          </View>
        )}

        {filtered.map(r => (
          <View key={r.id} style={styles.card}>
            <View style={styles.cardLeft}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{r.nickname[0].toUpperCase()}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.nickname}>{r.nickname}</Text>
                <Text style={styles.name}>{r.name}</Text>
                <Text style={styles.iban}>{r.iban}</Text>
              </View>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.payBtn}
                onPress={() => navigation.navigate('Payment', { screen: 'PaymentAmount' })}
              >
                <Text style={styles.payBtnText}>Öde</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(r)}>
                <Text style={styles.editBtnText}>✎</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(r.id)}>
                <Text style={styles.deleteBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Ekle / Düzenle modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editTarget ? 'Alıcıyı Düzenle' : 'Yeni Alıcı'}
                </Text>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.fieldLabel}>Ad Soyad / Kurum</Text>
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={t => setForm(f => ({ ...f, name: t }))}
                placeholder="Ahmet Yılmaz"
                placeholderTextColor={colors.textTertiary}
              />

              <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>IBAN</Text>
              <TextInput
                style={styles.input}
                value={form.iban}
                onChangeText={t => setForm(f => ({ ...f, iban: formatIban(t) }))}
                placeholder="TR00 0000 0000 0000 0000 0000 00"
                placeholderTextColor={colors.textTertiary}
                autoCapitalize="characters"
                maxLength={32}
              />

              <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>
                Kısa Ad (Nickname) <Text style={styles.optional}>isteğe bağlı</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={form.nickname}
                onChangeText={t => setForm(f => ({ ...f, nickname: t }))}
                placeholder='Örn. "Ev Sahibi", "Apartman"'
                placeholderTextColor={colors.textTertiary}
              />

              <View style={styles.modalActions}>
                <Button
                  title={editTarget ? 'Güncelle' : 'Kaydet'}
                  onPress={handleSave}
                  disabled={!isFormValid}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: screenPaddingHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  title: { ...typography.h1, color: colors.textPrimary },
  addBtn: {
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  addBtnText: { ...typography.label, color: colors.textInverse },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    marginHorizontal: screenPaddingHorizontal,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
    height: 46,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, ...typography.body, color: colors.textPrimary },

  list: {
    paddingHorizontal: screenPaddingHorizontal,
    paddingBottom: 130,
    gap: spacing.sm,
  },

  empty: { alignItems: 'center', paddingTop: spacing.xxxl, gap: spacing.md },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { ...typography.h3, color: colors.textPrimary },
  emptySubtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },

  card: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { ...typography.label, color: colors.textInverse },
  info: { flex: 1 },
  nickname: { ...typography.label, color: colors.textPrimary },
  name: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 1 },
  iban: { ...typography.caption, color: colors.textTertiary, marginTop: 1 },

  cardActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginLeft: spacing.sm },
  payBtn: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: spacing.sm,
  },
  payBtnText: { ...typography.caption, color: colors.textInverse, fontWeight: '700' },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: { fontSize: 16, color: colors.textSecondary },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: { fontSize: 14, color: colors.error, fontWeight: '700' },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  modalTitle: { ...typography.h2, color: colors.textPrimary },
  modalClose: { fontSize: 20, color: colors.textSecondary },
  fieldLabel: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.xs },
  optional: { ...typography.caption, color: colors.textTertiary, fontWeight: '400' },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    padding: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
  },
  modalActions: { marginTop: spacing.xl },
});
