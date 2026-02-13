import { AuthProvider } from "@/auth/AuthContext";
import AuthGate from "@/components/AuthGate";
import { StatusBar } from 'expo-status-bar';
export default function RootLayout() {
  return <AuthProvider>
    <StatusBar
      style="light"
      translucent={false}
      backgroundColor="#000" // IMPORTANT
    />
    <AuthGate/>
  </AuthProvider>;
}
