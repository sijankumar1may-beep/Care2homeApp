import { AuthContext } from '@/auth/AuthContext';
import { JourneyPriceBreakdown } from '@/components/JourneyPriceBreakdown';
import { Button, TextArea } from '@/components/ui';
import { reverseGeocodeNominatim } from '@/lib/api/care2home';
import { colors } from '@/lib/theme';
import type { JourneyPricingResult } from '@/lib/types/pricing';
import { buildBookingWhatsAppMessage, getWhatsAppUrl } from '@/lib/whatsapp';
import firestore from '@react-native-firebase/firestore';
import Storage from '@react-native-firebase/storage';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function BookCareElement() {
  const params = useLocalSearchParams<{
    source?: string;
    origin?: string;
    destination?: string;
    vehicleType?: string;
    pricingJson?: string;
  }>();

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [userAddress, setUserAddress] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [isDataSaving, setIsDataSaving] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [pricing, setPricing] = useState<JourneyPricingResult | null>(null);

  const auth = useContext(AuthContext);
  const loggedUser = auth?.user;

  useEffect(() => {
    if (loggedUser?.phoneNumber) {
      const num = loggedUser.phoneNumber.replace('+91', '');
      setPhone(num);
    }
  }, [loggedUser?.phoneNumber]);

  useEffect(() => {
    if (params.origin) setOrigin(String(params.origin));
    if (params.destination) {
      setDestination(String(params.destination));
      setUserAddress(String(params.destination));
    }
    if (params.pricingJson) {
      try {
        setPricing(JSON.parse(String(params.pricingJson)));
      } catch {
        setPricing(null);
      }
    }
  }, [params.origin, params.destination, params.pricingJson]);

  const chooseImageFromDevice = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow photo access');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const getCurrentAddress = async () => {
    try {
      setIsFetchingAddress(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow location access to autofill your address.');
        return;
      }
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const address = await reverseGeocodeNominatim(
        position.coords.latitude,
        position.coords.longitude,
      );
      setUserAddress(address);
    } catch {
      Alert.alert('Error', "Couldn't fetch your current address. Please try again.");
    } finally {
      setIsFetchingAddress(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage || !phone || !userAddress.trim()) {
      Alert.alert('Missing info', 'Please fill all required fields');
      return;
    }
    if (phone.length < 10) {
      Alert.alert('Missing info', 'Please enter a valid phone number');
      return;
    }

    setIsDataSaving(true);
    try {
      const fileName = `${Date.now()}-${phone}-ticket.jpg`;
      const refStorage = Storage().ref(`Care2homeWeb/${fileName}`);
      await refStorage.putFile(selectedImage);
      const imageUrl = await refStorage.getDownloadURL();

      await firestore().collection('Orders').add({
        phone,
        userAddress,
        email,
        loggedUserId: loggedUser?.phoneNumber ?? phone,
        ImageUrl: imageUrl,
        origin: origin || null,
        destination: destination || null,
        vehicleType: params.vehicleType || pricing?.vehicleType || null,
        pricingSnapshot: pricing || null,
        status: 'pending',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      const message = buildBookingWhatsAppMessage({
        phone,
        email,
        address: userAddress,
        imageUrl,
        pricing,
        origin,
        destination,
      });

      await Linking.openURL(getWhatsAppUrl(message));

      setIsSuccess(true);
      setPhone(loggedUser?.phoneNumber?.replace('+91', '') ?? '');
      setEmail('');
      setUserAddress('');
      setSelectedImage(undefined);
      setOrigin('');
      setDestination('');
      setPricing(null);
    } catch (error: any) {
      Alert.alert(
        'Booking Error',
        error?.message || 'Unable to submit booking. Please try again or contact us on WhatsApp.',
      );
    } finally {
      setIsDataSaving(false);
    }
  };

  if (isSuccess) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successCard}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successTitle}>Booking Received!</Text>
          <Text style={styles.successText}>
            Thank you for trusting Care2Home. Our team will contact you within 2 hours to confirm
            the details.
          </Text>
          <Button onPress={() => setIsSuccess(false)}>Book Another Journey</Button>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Book Travel Care Companion Service</Text>
        <Text style={styles.meta}>
          Available 24/7 • Airport, Railway & Bus Stand pickups • Delhi NCR
        </Text>
        <Text style={styles.desc}>
          Share your parent&apos;s travel details and we&apos;ll take care of the rest.
        </Text>
      </View>

      <View style={styles.card}>
        {pricing ? <JourneyPriceBreakdown pricing={pricing} /> : null}

        <Text style={styles.sectionTitle}>Parent&apos;s Information</Text>

        <Text style={styles.label}>Upload ticket image *</Text>
        <Pressable style={styles.uploadBox} onPress={chooseImageFromDevice}>
          {selectedImage ? (
            <View style={styles.previewWrapper}>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} contentFit="cover" />
              <Text style={styles.changeText}>Tap to change image</Text>
            </View>
          ) : (
            <Text style={styles.uploadPlaceholder}>Tap to upload ticket image</Text>
          )}
        </Pressable>

        <Text style={styles.label}>Pickup/Drop Address *</Text>
        <Pressable
          style={[styles.useLocationBtn, isFetchingAddress && styles.useLocationBtnDisabled]}
          onPress={getCurrentAddress}
          disabled={isFetchingAddress}
        >
          {isFetchingAddress ? (
            <ActivityIndicator size="small" color={colors.primaryBlue} />
          ) : (
            <Text style={styles.useLocationBtnText}>Use current location</Text>
          )}
        </Pressable>

        <TextArea
          value={userAddress}
          onChangeText={setUserAddress}
          placeholder="Enter complete pickup/drop address"
          rows={4}
        />

        <Text style={styles.label}>Your Phone Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="For booking confirmation and updates"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>Your Email (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="For booking confirmation"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Button onPress={handleSubmit} loading={isDataSaving} style={{ marginTop: 8 }}>
          Submit Request • We&apos;ll Call You
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: colors.careBlueLight,
  },
  header: { alignItems: 'center', marginBottom: 22 },
  title: { fontSize: 24, fontWeight: '700', color: colors.gray900, marginBottom: 12, textAlign: 'center' },
  meta: { fontSize: 12, color: colors.gray500, textAlign: 'center', marginBottom: 12 },
  desc: { fontSize: 15, color: colors.gray700, textAlign: 'center' },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.gray900, marginVertical: 14 },
  label: { fontSize: 13, fontWeight: '500', color: colors.gray700, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.gray900,
    marginBottom: 14,
  },
  uploadBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#93C5FD',
    borderRadius: 16,
    padding: 14,
    backgroundColor: colors.careBlueLight,
    marginBottom: 18,
  },
  previewWrapper: { alignItems: 'center' },
  previewImage: { width: '100%', height: 160, borderRadius: 12, marginBottom: 8 },
  uploadPlaceholder: {
    textAlign: 'center',
    color: colors.primaryBlue,
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 24,
  },
  changeText: { fontSize: 12, color: colors.primaryBlue, textAlign: 'center' },
  useLocationBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: colors.careBlueLight,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginBottom: 10,
  },
  useLocationBtnDisabled: { opacity: 0.7 },
  useLocationBtnText: { color: colors.primaryBlue, fontSize: 13, fontWeight: '600' },
  successContainer: {
    flex: 1,
    backgroundColor: colors.careBlueLight,
    justifyContent: 'center',
    padding: 24,
  },
  successCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 40,
    color: colors.ctaGreen,
    marginBottom: 12,
  },
  successTitle: { fontSize: 24, fontWeight: '700', color: colors.gray900, marginBottom: 12 },
  successText: { fontSize: 15, color: colors.gray500, textAlign: 'center', marginBottom: 20, lineHeight: 22 },
});
