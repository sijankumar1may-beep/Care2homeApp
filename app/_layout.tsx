import 'react-native-reanimated';
import { AuthProvider } from "@/auth/AuthContext";
import AuthGate from "@/components/AuthGate";
import DiscountPopup from "@/components/DiscountPopup";
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" translucent={false} backgroundColor="#1e40af" />
      <AuthGate />
      <DiscountPopup />
    </AuthProvider>
  );
}
