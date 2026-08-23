import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { ScalePressable } from '@/components/home/ScalePressable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colors, spacing } from '@/lib/theme';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, sendPasswordResetEmail } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Missing email', 'Please enter your email');
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(getAuth(), email);
      setSent(true);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenLayout
      title="Reset password"
      subtitle="We'll email you a reset link"
      footer={
        <ScalePressable onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.footerLink}>
            <Text style={styles.footerLinkBold}>Back to Login</Text>
          </Text>
        </ScalePressable>
      }
    >
      {sent ? (
        <View style={styles.successCard}>
          <Ionicons name="checkmark-circle" size={48} color={colors.ctaGreen} />
          <Text style={styles.successTitle}>Check your inbox</Text>
          <Text style={styles.successText}>
            Password reset link sent to {email}
          </Text>
          <Button
            onPress={() => router.replace('/(auth)/login')}
            size="lg"
            style={styles.backButton}
          >
            Back to Login
          </Button>
        </View>
      ) : (
        <>
          <View style={styles.emailRow}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={colors.primaryBlue}
              style={styles.emailIcon}
            />
            <View style={styles.emailInput}>
              <Input
                label="Email address"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          <Button onPress={handleReset} loading={loading} size="lg">
            Send Reset Link
          </Button>
        </>
      )}
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  emailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  emailIcon: {
    marginTop: 36,
    marginRight: spacing.sm,
  },
  emailInput: {
    flex: 1,
  },
  successCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.foreground,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  successText: {
    fontSize: 15,
    color: colors.gray700,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  backButton: {
    width: '100%',
  },
  footerLink: {
    fontSize: 14,
    textAlign: 'center',
  },
  footerLinkBold: {
    color: colors.primaryBlue,
    fontWeight: '600',
  },
});
