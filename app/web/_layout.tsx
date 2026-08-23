import { colors } from '@/lib/theme';
import { Stack } from 'expo-router';

export default function WebLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBlue },
        headerTintColor: colors.white,
      }}
    />
  );
}
