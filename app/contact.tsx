import { Ionicons } from '@expo/vector-icons';
import React, { JSX, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

/* ---------- Types ---------- */

type ContactForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

/* ---------- Screen ---------- */

export default function ContactScreen(): JSX.Element {
  const [form, setForm] = useState<ContactForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const onChange = (key: keyof ContactForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = () => {
    // TODO: replace with API call
    Alert.alert(
      'Message Sent',
      'Thanks for contacting us. We will get back to you shortly.'
    );
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Contact Us</Text>

      {/* ---------- FORM ---------- */}
      <Text style={styles.description}>
        Have questions about our services or want to provide feedback? Fill out
        the form and we’ll get back to you as soon as possible.
      </Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Input
            label="First Name"
            value={form.firstName}
            placeholder="Your first name"
            onChangeText={(v) => onChange('firstName', v)}
          />
          <Input
            label="Last Name"
            value={form.lastName}
            placeholder="Your last name"
            onChangeText={(v) => onChange('lastName', v)}
          />
        </View>

        <Input
          label="Email Address"
          value={form.email}
          placeholder="your.email@example.com"
          keyboardType="email-address"
          onChangeText={(v) => onChange('email', v)}
        />

        <Input
          label="Phone Number"
          value={form.phone}
          placeholder="+91 9910646415"
          keyboardType="phone-pad"
          onChangeText={(v) => onChange('phone', v)}
        />

        <Input
          label="Message"
          value={form.message}
          placeholder="Tell us about your inquiry..."
          multiline
          numberOfLines={5}
          onChangeText={(v) => onChange('message', v)}
        />

        <Pressable style={styles.button} onPress={onSubmit}>
          <Text style={styles.buttonText}>Send</Text>
        </Pressable>
      </View>

      {/* ---------- INFO ---------- */}
      <Text style={styles.sectionTitle}>Our Information</Text>

      <View style={styles.infoCard}>
        <InfoItem
          icon="location-outline"
          title="Location"
          value="New Ashok Nagar, Mayur Vihar, East Delhi, Delhi, 110096, India"
        />

        <InfoItem
          icon="call-outline"
          title="Phone"
          value="+91 9910646415"
        />

        <InfoItem
          icon="mail-outline"
          title="Email"
          value="info@care2home.co"
        />

        <InfoItem
          icon="time-outline"
          title="Availability"
          value="24 × 7"
        />
      </View>
    </ScrollView>
  );
}

/* ---------- Reusable Components ---------- */

type InputProps = {
  label: string;
  value: string;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  onChangeText: (text: string) => void;
};

function Input({
  label,
  ...props
}: InputProps): JSX.Element {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} {...props} />
    </View>
  );
}

type InfoItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
};

function InfoItem({
  icon,
  title,
  value,
}: InfoItemProps): JSX.Element {
  return (
    <View style={styles.infoItem}>
      <Ionicons name={icon} size={22} color="#2563EB" />
      <View style={{ marginLeft: 12 }}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    color: '#4B5563',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  infoTitle: {
    fontWeight: '600',
  },
  infoValue: {
    color: '#4B5563',
    marginTop: 2,
  },
});
