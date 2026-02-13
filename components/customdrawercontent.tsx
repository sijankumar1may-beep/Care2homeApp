// app/(drawer)/CustomDrawerContent.tsx

import { Ionicons } from '@expo/vector-icons';
import { getAuth, signOut } from '@react-native-firebase/auth';
import {
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
/* ---------- Types ---------- */
import { AuthContext } from '@/auth/AuthContext';
import { useContext } from 'react';
type NavLink = {
  label: string;
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
  danger?: boolean;
};

/* ---------- Links Data ---------- */

const NAV_LINKS: NavLink[] = [
  { label: 'My bookings', route: '/mybookings', icon: 'clipboard-outline' },
  { label: 'Profile', route: '/profile', icon: 'person-outline' },
  { label: 'About Us', route: '/about', icon: 'information-circle-outline' },
  { label: 'Contact Us', route: '/contact', icon: 'call-outline' },
  {
    label: 'Logout',
    route: '/logout',
    icon: 'log-out-outline',
    danger: true,
  },
];

/* ---------- Component ---------- */
const profilePlaceholder = require('@/assets/images/profile.png');
export default function CustomDrawerContent(props: any) {
  const Auth = useContext(AuthContext);
    if (!Auth) return null;

    const user = Auth.user;
  const { navigation } = props;

  const handleNavigate = (route: string) => {

    if (route == '/logout') {
      Alert.alert("Dear user", "Do you want to log out?", [{ text: "Yes", onPress: () => { signOut(getAuth()).then(() => { }) }, style: 'default' }, { text: "No", onPress: () => { }, style: 'default' }]);

    } else {
      (navigation as any).closeDrawer();
      router.push(route as any);
    }


  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ paddingTop: 50 }}
    >

      <View
        style={{
          paddingVertical: 40,
          alignItems: 'center',
        }}
      >
        <Image
          source={profilePlaceholder}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 12,
          }}
        />      
        <Text style={{ color: '#000', fontSize: 14 }}>
          {user.email}
        </Text>
      </View>
      <View>
        {NAV_LINKS.map((item) => (
          <Pressable
            key={item.label}
            style={styles.link}
            onPress={() => handleNavigate(item.route)}
          >
            <Ionicons
              name={item.icon}
              size={22}
              color={item.danger ? '#DC2626' : '#364153'}
            />
            <Text
              style={[
                styles.label,
                item.danger && { color: '#DC2626' },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </DrawerContentScrollView>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  label: {
    marginLeft: 16,
    fontSize: 16,
    color: '#111827',
  },
});
