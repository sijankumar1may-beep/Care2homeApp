import { firstTimeUserDiscountPercent } from '@/lib/pricing/pricing-config';
import { colors, WHATSAPP_NUMBER } from '@/lib/theme';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const STORAGE_KEY = 'care2home_discount_popup_seen';

export default function DiscountPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    AsyncStorage.getItem(STORAGE_KEY).then((seen) => {
      if (!seen) {
        timer = setTimeout(() => setVisible(true), 500);
      }
    });

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleClose = async () => {
    setVisible(false);
    await AsyncStorage.setItem(STORAGE_KEY, 'true');
  };

  const openWhatsApp = () => {
    const message = `Hi, I'm interested in the ${firstTimeUserDiscountPercent}% discount offer for Care2Home's parent pickup and drop service. Could you please share more details?`;
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`);
    handleClose();
  };

  const bookNow = () => {
    handleClose();
    router.push('/(drawer)/(tabs)/bookservice');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable style={styles.popup} onPress={(e) => e.stopPropagation()}>
          <Pressable style={styles.closeBtn} onPress={handleClose}>
            <Ionicons name="close" size={24} color={colors.gray500} />
          </Pressable>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>{firstTimeUserDiscountPercent}% OFF</Text>
          </View>

          <Text style={styles.title}>
            Special Offer for{'\n'}
            <Text style={styles.titleAccent}>First-Time Users!</Text>
          </Text>

          <Text style={styles.description}>
            Get <Text style={styles.bold}>{firstTimeUserDiscountPercent}% discount</Text> on your
            first booking. Safe travel for your parents, peace of mind for you.
          </Text>

          <View style={styles.actions}>
            <Pressable style={styles.primaryBtn} onPress={bookNow}>
              <Text style={styles.primaryBtnText}>Book Now & Save</Text>
            </Pressable>
            <Pressable style={styles.greenBtn} onPress={openWhatsApp}>
              <Text style={styles.primaryBtnText}>Talk on WhatsApp</Text>
            </Pressable>
          </View>

          <Text style={styles.finePrint}>
            * Valid for first-time users only. Terms & conditions apply.
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  popup: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  closeBtn: { position: 'absolute', top: 12, right: 12, zIndex: 1, padding: 4 },
  badge: {
    alignSelf: 'center',
    backgroundColor: colors.primaryBlue,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: { color: colors.white, fontSize: 20, fontWeight: '700' },
  title: { fontSize: 26, fontWeight: '700', color: colors.gray900, textAlign: 'center', marginBottom: 12 },
  titleAccent: { color: colors.primaryBlue },
  description: { fontSize: 16, color: colors.gray500, textAlign: 'center', marginBottom: 20, lineHeight: 24 },
  bold: { fontWeight: '700', color: colors.primaryBlue },
  actions: { gap: 10 },
  primaryBtn: {
    backgroundColor: colors.primaryBlue,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  greenBtn: {
    backgroundColor: colors.ctaGreen,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  finePrint: { fontSize: 11, color: colors.gray500, textAlign: 'center', marginTop: 12 },
});
