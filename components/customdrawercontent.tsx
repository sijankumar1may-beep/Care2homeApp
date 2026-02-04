// app/(drawer)/CustomDrawerContent.tsx

import { Ionicons } from '@expo/vector-icons';
import {
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
/* ---------- Types ---------- */

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
  { label: 'Settings', route: '/settings', icon: 'settings-outline' },
  {
    label: 'Logout',
    route: '/logout',
    icon: 'log-out-outline',
    danger: true,
  },
];

/* ---------- Component ---------- */

export default function CustomDrawerContent(props: any) {
  const { navigation } = props;

  const handleNavigate = (route: string) => {
    (navigation as any).closeDrawer();
    router.push(route as any);

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
          source={{ uri: 'https://i.pravatar.cc/150' }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 12,
          }}
        />

        <Text style={{ color: '#000', fontSize: 20, fontWeight: '600' }}>
          Sumit Kumar
        </Text>
        <Text style={{ color: '#000', fontSize: 14 }}>
          sumit@email.com
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
