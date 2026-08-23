import { AuthContext } from '@/auth/AuthContext';
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { ScalePressable } from '@/components/home/ScalePressable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colors, spacing } from '@/lib/theme';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, getAuth } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { useContext, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const appContext = useContext(AuthContext);

  if (!appContext) {
    return null;
  }

  const handleSignup = async () => {
    if (password.length < 6) {
      Alert.alert('Dear user', 'Password should be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(getAuth(), email, password);
      Alert.alert('Success', 'You have successfully signed up');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Dear user', 'You already have an account using this email', [
          {
            text: 'Forgot password',
            onPress: () => router.push('/(auth)/resetpassword'),
            style: 'default',
          },
          { text: 'Signup with another email', onPress: () => {}, style: 'default' },
        ]);
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Invalid email', 'That email address is invalid!');
      } else {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenLayout
      title="Create account"
      subtitle="Create your Care2home account"
      footer={
        <ScalePressable onPress={() => router.back()}>
          <Text style={styles.footerLink}>
            Already have an account? <Text style={styles.footerLinkBold}>Login</Text>
          </Text>
        </ScalePressable>
      }
    >
      <Input
        label="Name"
        placeholder="Your full name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

      <Input
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <View style={styles.passwordWrapper}>
        <Input
          label="Password"
          placeholder="Create a password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
        />
        <Pressable
          style={styles.eyeButton}
          onPress={() => setShowPassword((prev) => !prev)}
          hitSlop={8}
        >
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color={colors.gray500}
          />
        </Pressable>
      </View>

      {password.length > 0 && password.length < 6 ? (
        <Text style={styles.hint}>At least 6 characters required</Text>
      ) : null}

      <Button onPress={handleSignup} loading={loading} size="lg" style={styles.submitButton}>
        Create Account
      </Button>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  passwordWrapper: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 44,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    top: 38,
  },
  hint: {
    fontSize: 13,
    color: colors.gray500,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  footerLink: {
    fontSize: 14,
    color: colors.gray700,
    textAlign: 'center',
  },
  footerLinkBold: {
    color: colors.primaryBlue,
    fontWeight: '600',
  },
});
