import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F6FA' }}>
      {/* HEADER */}
      <View
        style={{
          backgroundColor: '#364153',
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

        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '600' }}>
          Sumit Kumar
        </Text>
        <Text style={{ color: '#CBD5E1', fontSize: 14 }}>
          sumit@email.com
        </Text>

        <Pressable
          onPress={() => router.push('/')}
          style={{
            marginTop: 16,
            backgroundColor: '#fff',
            paddingHorizontal: 20,
            paddingVertical: 8,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: '#364153', fontWeight: '600' }}>
            Edit Profile
          </Text>
        </Pressable>
      </View>

      {/* INFO SECTION */}
      <View style={{ padding: 20 }}>
        <ProfileItem
          icon="call-outline"
          label="Phone"
          value="+91 85070 64152"
        />

        <ProfileItem
          icon="location-outline"
          label="Address"
          value="Jaipur, Rajasthan"
        />

        <ProfileItem
          icon="briefcase-outline"
          label="Role"
          value="Customer"
        />
      </View>

      {/* ACTIONS */}
      <View style={{ marginTop: 10 }}>
        <ActionItem
          icon="book-outline"
          title="My Orders"
          onPress={() => router.push('/')}
        />

        <ActionItem
          icon="settings-outline"
          title="Settings"
          onPress={() => router.push('/')}
        />

        <ActionItem
          icon="log-out-outline"
          title="Logout"
          danger
          onPress={() => console.log('Logout')}
        />
      </View>
    </ScrollView>
  );
}

/* ---------- Components ---------- */

type ProfileItemProps = {
  icon: string;
  label: string;
  value: string;
};

function ProfileItem({ icon, label, value }: ProfileItemProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
      }}
    >
      <Ionicons name={icon as any} size={22} color="#364153" />
      <View style={{ marginLeft: 12 }}>
        <Text style={{ color: '#64748B', fontSize: 12 }}>{label}</Text>
        <Text style={{ fontSize: 15, fontWeight: '500' }}>{value}</Text>
      </View>
    </View>
  );
}

type ActionItemProps = {
  icon: string;
  title: string;
  onPress: () => void;
  danger?: boolean;
};

function ActionItem({ icon, title, onPress, danger = false }: ActionItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
      }}
    >
      <Ionicons
        name={icon as any}
        size={22}
        color={danger ? '#DC2626' : '#364153'}
      />
      <Text
        style={{
          marginLeft: 16,
          fontSize: 16,
          color: danger ? '#DC2626' : '#111827',
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
