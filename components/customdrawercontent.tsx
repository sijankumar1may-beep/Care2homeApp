import { AuthContext } from '@/auth/AuthContext';
import { navigateFromDrawer } from '@/lib/navigation';
import { colors } from '@/lib/theme';
import { WEB_ROUTE_SECTIONS } from '@/lib/webRoutes';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signOut } from '@react-native-firebase/auth';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useContext, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

const profilePlaceholder = require('@/assets/images/profile.png');
import { brandAssets } from '@/lib/assets';

export default function CustomDrawerContent(props: any) {
  const Auth = useContext(AuthContext);
  const { navigation } = props;
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Serving Stations': true,
  });

  if (!Auth) return null;
  const user = Auth.user;

  const closeDrawer = () => (navigation as any).closeDrawer();

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleNavigate = (path: string, title: string) => {
    if (path === '/logout') {
      Alert.alert('Dear user', 'Do you want to log out?', [
        { text: 'Yes', onPress: () => signOut(getAuth()) },
        { text: 'No', style: 'cancel' },
      ]);
      return;
    }

    if (path === '/mybookings' || path === '/profile') {
      closeDrawer();
      router.push(path as any);
      return;
    }

    navigateFromDrawer(path, title, closeDrawer);
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Image source={brandAssets.logo} style={styles.logo} contentFit="contain" />
        <Image source={profilePlaceholder} style={styles.avatar} />
        <Text style={styles.userText}>{user?.email || user?.phoneNumber}</Text>
      </View>

      {WEB_ROUTE_SECTIONS.map((section) => (
        <View key={section.title}>
          <Pressable style={styles.sectionHeader} onPress={() => toggleSection(section.title)}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Ionicons
              name={expandedSections[section.title] ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={colors.gray500}
            />
          </Pressable>
          {expandedSections[section.title]
            ? section.routes.map((route) => (
                <Pressable
                  key={route.path}
                  style={styles.link}
                  onPress={() => handleNavigate(route.path, route.label)}
                >
                  <Ionicons
                    name={(route.icon as any) || 'chevron-forward-outline'}
                    size={20}
                    color={colors.headerBlue}
                  />
                  <Text style={styles.label}>{route.label}</Text>
                </Pressable>
              ))
            : null}
        </View>
      ))}

      <Pressable style={styles.link} onPress={() => handleNavigate('/logout', 'Logout')}>
        <Ionicons name="log-out-outline" size={20} color={colors.danger} />
        <Text style={[styles.label, { color: colors.danger }]}>Logout</Text>
      </Pressable>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: 40, paddingBottom: 24 },
  header: { alignItems: 'center', paddingVertical: 20, paddingHorizontal: 16 },
  logo: { width: 140, height: 44, marginBottom: 16 },
  avatar: { width: 72, height: 72, borderRadius: 36, marginBottom: 8 },
  userText: { color: colors.gray700, fontSize: 13 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.careBlueLight,
    marginTop: 8,
  },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.headerBlue, textTransform: 'uppercase' },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 12,
  },
  label: { fontSize: 15, color: colors.gray900, flex: 1 },
});
