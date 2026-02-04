import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { JSX } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

/* ---------- Types ---------- */

type NavLink = {
  label: string;
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
  danger?: boolean;
};

type NavigationLinksProps = {
  onNavigate?: () => void; // optional (e.g. close drawer)
};

/* ---------- Links Data ---------- */

const NAV_LINKS: NavLink[] = [
  {
    label: 'Home',
    route: '/',
    icon: 'home-outline',
  },
  {
    label: 'Profile',
    route: '/',
    icon: 'person-outline',
  },
  {
    label: 'Pricing',
    route: '/',
    icon: 'pricetag-outline',
  },
  {
    label: 'Book Service',
    route: '/',
    icon: 'calendar-outline',
  },
  {
    label: 'About Us',
    route: '/',
    icon: 'information-circle-outline',
  },
  {
    label: 'Contact Us',
    route: '/',
    icon: 'call-outline',
  },
  {
    label: 'Settings',
    route: '/',
    icon: 'settings-outline',
  },
  {
    label: 'Logout',
    route: '/',
    icon: 'log-out-outline',
    danger: true,
  },
];

/* ---------- Component ---------- */

export default function NavigationLinks({
  onNavigate,
}: NavigationLinksProps): JSX.Element {
  return (
    <View>
      {NAV_LINKS.map((item) => (
        <Pressable
          key={item.route}
          style={styles.link}
          onPress={() => {
            router.push(item.route as any);
            onNavigate?.();
          }}
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
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  label: {
    marginLeft: 16,
    fontSize: 16,
    color: '#111827',
  },
});
