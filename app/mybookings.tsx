import { AuthContext } from '@/auth/AuthContext';
import firestore from '@react-native-firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
/* ---------- Types ---------- */

type TabType = 'active' | 'upcoming' | 'completed';

type Booking = {
  bookingId: string;
  status: string;
  statusColor: string;
  careCompanion: string;
  ImageUrl: string;
  email: string;
  emergency?: string;
  phone: string;
};

/* ---------- Screen ---------- */

export default function MyBookingsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [bookingsByTab, setBookingsByTab] = useState<Record<TabType, Booking[]>>({
    active: [],
    upcoming: [],
    completed: [],
  });
  const auth = useContext(AuthContext);
  const user = auth?.user;

  const AdditionData = {
    bookingId: '#CH2024001',
    status: 'In Progress',
    statusColor: '#22C55E',
    careCompanion: 'Deepak kumar',
  };

  // Load bookings when the logged-in user's email is available
  useEffect(() => {
    console.log('MyBookingsScreen mounted, user =', user?.email);

    if (!user?.phoneNumber) {
      console.log('No user email yet, skipping bookings fetch');
      return;
    }

    async function getAllMyOrders() {
      const snapshot = await firestore()
        .collection('Orders')
        .where('loggedUserId', '==', user.phoneNumber)
        .get();

      const bookings = snapshot.docs.map((doc) => ({
        bookingId: AdditionData.bookingId,
        status: AdditionData.status,
        statusColor: AdditionData.statusColor,
        careCompanion: AdditionData.careCompanion,
        ImageUrl: doc.data().ImageUrl ?? '',
        email: doc.data().email ?? '',
        emergency: doc.data().emergency,
        phone: doc.data().phone ?? '',
      }));

      console.log('Bookings for user', user.email, bookings);
      setBookingsByTab((prev) => ({
        ...prev,
        active: bookings,
      }));
    }

    getAllMyOrders();
  }, [user?.email]);

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <Tab label="Active" value="active" activeTab={activeTab} onPress={setActiveTab} />
        <Tab label="Upcoming" value="upcoming" activeTab={activeTab} onPress={setActiveTab} />
        <Tab label="Completed" value="completed" activeTab={activeTab} onPress={setActiveTab} />
      </View>

      {/* Booking List */}
      <FlatList
        data={bookingsByTab[activeTab]}
        keyExtractor={(item,index) => item.bookingId+index}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No bookings found</Text>
        }
        renderItem={({ item }) => <BookingCard booking={item} />}
      />
    </View>
  );
}

/* ---------- Tab ---------- */

function Tab({
  label,
  value,
  activeTab,
  onPress,
}: {
  label: string;
  value: TabType;
  activeTab: TabType;
  onPress: (tab: TabType) => void;
}) {
  const isActive = activeTab === value;

  return (
    <Pressable
      onPress={() => onPress(value)}
      style={[styles.tab, isActive && styles.activeTab]}
    >
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {label}
      </Text>
    </Pressable>
  );
}

/* ---------- Booking Card ---------- */

function BookingCard({ booking }: { booking: Booking }) {
  const number=(Math.random()*100).toFixed();
  return (
    <View style={styles.card}>
      {/* Top Row */}
      <View style={styles.rowBetween}>
        <Text style={styles.bookingId}>ID: {booking.bookingId+number}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: booking.statusColor },
          ]}
        >
          <Text style={styles.statusText}>{booking.status}</Text>
        </View>
      </View>

      {/* Care Companion */}
      <Text style={styles.route}>
        Care Companion: {booking.careCompanion}
      </Text>

      {/* Contact Details */}
      <View style={styles.row}>
        <Text style={styles.dateText}>Phone: {booking.phone}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.dateText}>Email: {booking.email}</Text>
      </View>
      {booking.emergency ? (
        <View style={styles.row}>
          <Text style={styles.dateText}>Emergency: {booking.emergency}</Text>
        </View>
      ) : null}
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2563EB',
  },
  tabText: {
    color: '#6B7280',
  },
  activeTabText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#9CA3AF',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  bookingId: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  route: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8,
  },
  dateText: {
    marginLeft: 8,
    color: '#374151',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  avatar: {
    backgroundColor: '#2563EB',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  driver: {
    fontSize: 14,
    fontWeight: '500',
  },
  rating: {
    color: '#6B7280',
    fontWeight: '400',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionText: {
    color: '#2563EB',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
