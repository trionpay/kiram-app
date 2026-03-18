import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Modal, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LegalModal } from '../../components/LegalModal';
import { colors, typography, spacing, screenPaddingHorizontal } from '../../theme';

const MOCK_USER = {
  name: 'Baran Bedir',
  phone: '+90 534 338 9130',
  email: 'baran@kiram.com',
  city: 'İstanbul',
};

function SectionHeader({ title }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function MenuItem({ icon, label, value, onPress, danger }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuLeft}>
        <Text style={styles.menuIcon}>{icon}</Text>
        <Text style={[styles.menuLabel, danger && { color: colors.error }]}>{label}</Text>
      </View>
      <View style={styles.menuRight}>
        {value ? <Text style={styles.menuValue}>{value}</Text> : null}
        <Text style={[styles.menuChevron, danger && { color: colors.error }]}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

export function ProfileScreen({ navigation }) {
  const [legalDoc, setLegalDoc] = useState(null);
  const [showEditEmail, setShowEditEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLogout = () => {
    navigation.getParent()?.getParent()?.replace('Auth');
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    // Mock: API bağlandığında gerçek pasife alma isteği gönderilecek
    navigation.getParent()?.getParent()?.replace('Auth');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profil kartı */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>{MOCK_USER.name[0]}</Text>
          </View>
          <View>
            <Text style={styles.profileName}>{MOCK_USER.name}</Text>
            <Text style={styles.profilePhone}>{MOCK_USER.phone}</Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Kimlik Doğrulandı</Text>
            </View>
          </View>
        </View>

        {/* Hesap Bilgileri */}
        <SectionHeader title="Hesap Bilgileri" />
        <View style={styles.section}>
          <MenuItem
            icon="📧"
            label="E-posta"
            value={MOCK_USER.email}
            onPress={() => setShowEditEmail(true)}
          />
          <MenuItem
            icon="📍"
            label="Şehir"
            value={MOCK_USER.city}
            onPress={() => {}}
          />
          <MenuItem
            icon="🔒"
            label="Şifre Değiştir"
            onPress={() => {}}
          />
        </View>

        {/* Yasal */}
        <SectionHeader title="Yasal" />
        <View style={styles.section}>
          <MenuItem icon="📄" label="KVKK Aydınlatma Metni" onPress={() => setLegalDoc('kvkk')} />
          <MenuItem icon="📋" label="Kullanıcı Sözleşmesi" onPress={() => setLegalDoc('terms')} />
          <MenuItem icon="🔐" label="Gizlilik Politikası" onPress={() => setLegalDoc('privacy')} />
        </View>

        {/* Hesap */}
        <SectionHeader title="Hesap" />
        <View style={styles.section}>
          <MenuItem
            icon="🚪"
            label="Çıkış Yap"
            onPress={handleLogout}
          />
          <MenuItem
            icon="🗑"
            label="Hesabımı Sil"
            onPress={() => setShowDeleteModal(true)}
            danger
          />
        </View>

        <Text style={styles.versionText}>Kiram v1.0.0</Text>
      </ScrollView>

      {/* Yasal doküman overlay */}
      {legalDoc && (
        <LegalModal docKey={legalDoc} onClose={() => setLegalDoc(null)} />
      )}

      {/* E-posta düzenleme modal */}
      <Modal visible={showEditEmail} transparent animationType="slide">
        <View style={styles.editOverlay}>
          <View style={styles.editSheet}>
            <View style={styles.editHandle} />
            <Text style={styles.editTitle}>E-posta Güncelle</Text>
            <TextInput
              style={styles.editInput}
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder={MOCK_USER.email}
              placeholderTextColor={colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
            />
            <TouchableOpacity
              style={[styles.editSaveBtn, !newEmail.includes('@') && { opacity: 0.5 }]}
              onPress={() => setShowEditEmail(false)}
              disabled={!newEmail.includes('@')}
            >
              <Text style={styles.editSaveBtnText}>Kaydet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editCancelBtn} onPress={() => setShowEditEmail(false)}>
              <Text style={styles.editCancelText}>Vazgeç</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Hesap silme onay modal */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View style={styles.deleteOverlay}>
          <View style={styles.deleteCard}>
            <Text style={styles.deleteIcon}>⚠️</Text>
            <Text style={styles.deleteTitle}>Hesabınızı silmek istediğinize emin misiniz?</Text>
            <Text style={styles.deleteSubtitle}>
              Bu işlem geri alınamaz. Hesabınız yasal saklama süreleri dışında pasife alınacaktır.
            </Text>
            <TouchableOpacity style={styles.deleteConfirmBtn} onPress={handleDeleteAccount}>
              <Text style={styles.deleteConfirmText}>Hesabımı Sil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteCancelBtn} onPress={() => setShowDeleteModal(false)}>
              <Text style={styles.deleteCancelText}>Vazgeç</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 130 },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: screenPaddingHorizontal,
    paddingBottom: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    marginBottom: spacing.md,
  },
  avatarLarge: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { ...typography.h2, color: colors.textInverse },
  profileName: { ...typography.h3, color: colors.textPrimary },
  profilePhone: { ...typography.body, color: colors.textSecondary, marginTop: 2 },
  verifiedBadge: {
    marginTop: spacing.xs,
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    alignSelf: 'flex-start',
  },
  verifiedText: { ...typography.caption, color: colors.success },

  sectionHeader: {
    ...typography.caption,
    color: colors.textTertiary,
    paddingHorizontal: screenPaddingHorizontal,
    paddingBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  section: {
    backgroundColor: colors.backgroundElevated,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: screenPaddingHorizontal,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  menuIcon: { fontSize: 18, width: 24, textAlign: 'center' },
  menuLabel: { ...typography.body, color: colors.textPrimary },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  menuValue: { ...typography.bodySmall, color: colors.textSecondary },
  menuChevron: { fontSize: 20, color: colors.textTertiary },

  versionText: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },

  /* E-posta düzenleme */
  editOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  editSheet: {
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: screenPaddingHorizontal,
    paddingBottom: 40,
  },
  editHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginVertical: spacing.md },
  editTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.lg },
  editInput: {
    backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: 14, padding: spacing.md, ...typography.body, color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  editSaveBtn: { backgroundColor: colors.accent, borderRadius: 14, height: 50, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  editSaveBtnText: { ...typography.label, color: colors.textInverse },
  editCancelBtn: { alignItems: 'center', paddingVertical: spacing.sm },
  editCancelText: { ...typography.label, color: colors.textSecondary },

  /* Hesap silme */
  deleteOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: screenPaddingHorizontal },
  deleteCard: { backgroundColor: colors.backgroundElevated, borderRadius: 20, padding: spacing.xl, width: '100%', alignItems: 'center' },
  deleteIcon: { fontSize: 40, marginBottom: spacing.md },
  deleteTitle: { ...typography.h3, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
  deleteSubtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl },
  deleteConfirmBtn: { backgroundColor: colors.error, borderRadius: 14, height: 50, width: '100%', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  deleteConfirmText: { ...typography.label, color: colors.textInverse },
  deleteCancelBtn: { alignItems: 'center', paddingVertical: spacing.sm },
  deleteCancelText: { ...typography.label, color: colors.textSecondary },
});
