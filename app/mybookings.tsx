import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
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
  id: string;
  bookingId: string;
  from: string;
  to: string;
  date: string;
  time: string;
  status: string;
  statusColor: string;
  driver: string;
  rating: string;
  vehicle: string;
  actions: string[];
};

/* ---------- Mock Data ---------- */

const BOOKINGS: Record<TabType, Booking[]> = {
  active: [
    {
      id: '1',
      bookingId: '#CH2024001',
      from: 'IGI Airport T3',
      to: 'Dwarka Sector 10',
      date: 'Today, 29 Jan 2026',
      time: '10:00 AM',
      status: 'In Progress',
      statusColor: '#22C55E',
      driver: 'Rajesh Kumar',
      rating: '4.9',
      vehicle: 'Auto',
      actions: ['Track Live', 'Call'],
    },
  ],
  upcoming: [
    {
      id: '2',
      bookingId: '#CH2024002',
      from: 'Home',
      to: 'New Delhi Station',
      date: '30 Jan 2026',
      time: '7:00 AM',
      status: 'Tomorrow',
      statusColor: '#F59E0B',
      driver: 'Priya Sharma',
      rating: '5.0',
      vehicle: 'Car',
      actions: ['Edit', 'Details'],
    },
  ],
  completed: [],
};

/* ---------- Screen ---------- */

export default function MyBookingsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('active');

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
        data={BOOKINGS[activeTab]}
        keyExtractor={(item) => item.id}
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
  return (
    <View style={styles.card}>
      {/* Top Row */}
      <View style={styles.rowBetween}>
        <Text style={styles.bookingId}>ID: {booking.bookingId}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: booking.statusColor },
          ]}
        >
          <Text style={styles.statusText}>{booking.status}</Text>
        </View>
      </View>

      {/* Route */}
      <Text style={styles.route}>
        {booking.from} → {booking.to}
      </Text>

      {/* Date */}
      <View style={styles.row}>
        <Ionicons name="calendar-outline" size={16} />
        <Text style={styles.dateText}>
          {booking.date} • {booking.time}
        </Text>
      </View>

      <View style={styles.divider} />

      {/* Driver */}
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={20} color="#FFF" />
        </View>
        <Text style={styles.driver}>
          {booking.driver}{' '}
          <Text style={styles.rating}>⭐ {booking.rating} • {booking.vehicle}</Text>
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {booking.actions.map((action) => (
          <Pressable key={action} style={styles.actionBtn}>
            <Text style={styles.actionText}>{action}</Text>
          </Pressable>
        ))}
      </View>
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
