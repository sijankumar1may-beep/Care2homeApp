import { AuthContext } from '@/auth/AuthContext';
import { formatIndianCurrencyRange } from '@/lib/pricing/pricing';
import { colors } from '@/lib/theme';
import type { JourneyPricingResult } from '@/lib/types/pricing';
import firestore from '@react-native-firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

type TabType = 'active' | 'upcoming' | 'completed';

type Booking = {
  id: string;
  bookingId: string;
  status: string;
  statusColor: string;
  ImageUrl: string;
  email: string;
  phone: string;
  userAddress: string;
  origin?: string;
  destination?: string;
  vehicleType?: string;
  pricingSnapshot?: JourneyPricingResult | null;
  createdAt?: any;
};

const STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B',
  active: '#22C55E',
  'in progress': '#22C55E',
  upcoming: '#2563EB',
  completed: '#6B7280',
  cancelled: '#DC2626',
};

function getStatusColor(status: string): string {
  return STATUS_COLORS[status.toLowerCase()] ?? '#6B7280';
}

function categorizeBooking(status: string): TabType {
  const normalized = status.toLowerCase();
  if (normalized === 'completed' || normalized === 'cancelled') return 'completed';
  if (normalized === 'upcoming' || normalized === 'scheduled') return 'upcoming';
  return 'active';
}

function getCreatedAtMs(createdAt: Booking['createdAt']): number {
  if (!createdAt) return 0;
  if (typeof createdAt.toDate === 'function') return createdAt.toDate().getTime();
  if (createdAt instanceof Date) return createdAt.getTime();
  if (typeof createdAt === 'number') return createdAt;
  if (typeof createdAt === 'string') {
    const parsed = Date.parse(createdAt);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  if (typeof createdAt.seconds === 'number') return createdAt.seconds * 1000;
  return 0;
}

function sortByCreatedAtDesc(bookings: Booking[]): Booking[] {
  return [...bookings].sort(
    (a, b) => getCreatedAtMs(b.createdAt) - getCreatedAtMs(a.createdAt),
  );
}

function formatCreatedAt(createdAt: Booking['createdAt']): string | null {
  const ms = getCreatedAtMs(createdAt);
  if (!ms) return null;

  return new Date(ms).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export default function MyBookingsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [bookingsByTab, setBookingsByTab] = useState<Record<TabType, Booking[]>>({
    active: [],
    upcoming: [],
    completed: [],
  });
  const auth = useContext(AuthContext);
  const user = auth?.user;

  useEffect(() => {
    if (!user?.phoneNumber) return;

    const unsubscribe = firestore()
      .collection('Orders')
      .where('loggedUserId', '==', user.phoneNumber)
      .onSnapshot(
        (snapshot) => {
          const grouped: Record<TabType, Booking[]> = {
            active: [],
            upcoming: [],
            completed: [],
          };

          snapshot.docs.forEach((doc) => {

            const data = doc.data();
            console.log(data);
            const status = (data.status as string) || 'pending';
            const booking: Booking = {
              id: doc.id,
              bookingId: `#CH${doc.id.slice(0, 6).toUpperCase()}`,
              status,
              statusColor: getStatusColor(status),
              ImageUrl: data.ImageUrl ?? '',
              email: data.email ?? '',
              phone: data.phone ?? '',
              userAddress: data.userAddress ?? '',
              origin: data.origin,
              destination: data.destination,
              vehicleType: data.vehicleType,
              pricingSnapshot: data.pricingSnapshot ?? null,
              createdAt: data.createdAt,
            };
            grouped[categorizeBooking(status)].push(booking);
          });

          (Object.keys(grouped) as TabType[]).forEach((tab) => {
            grouped[tab] = sortByCreatedAtDesc(grouped[tab]);
          });

          setBookingsByTab(grouped);
        },
        (error) => console.error('Bookings fetch error:', error),
      );

    return () => unsubscribe();
  }, [user?.phoneNumber]);

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <Tab label="Active" value="active" activeTab={activeTab} onPress={setActiveTab} />
        <Tab label="Upcoming" value="upcoming" activeTab={activeTab} onPress={setActiveTab} />
        <Tab label="Completed" value="completed" activeTab={activeTab} onPress={setActiveTab} />
      </View>

      <FlatList
        data={bookingsByTab[activeTab]}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No bookings found</Text>}
        renderItem={({ item }) => <BookingCard booking={item} />}
      />
    </View>
  );
}

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
    <Pressable onPress={() => onPress(value)} style={[styles.tab, isActive && styles.activeTab]}>
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>{label}</Text>
    </Pressable>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const pricing = booking.pricingSnapshot;
  const createdAtLabel = formatCreatedAt(booking.createdAt);

  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <View>
          <Text style={styles.bookingId}>{booking.bookingId}</Text>
          {createdAtLabel ? (
            <Text style={styles.createdAt}>Booked on {createdAtLabel}</Text>
          ) : null}
        </View>
        <View style={[styles.statusBadge, { backgroundColor: booking.statusColor }]}>
          <Text style={styles.statusText}>{booking.status}</Text>
        </View>
      </View>

      <Text style={styles.address}>{booking.userAddress}</Text>

      {booking.origin || booking.destination ? (
        <Text style={styles.route}>
          {booking.origin ? `From: ${booking.origin}` : ''}
          {booking.origin && booking.destination ? '\n' : ''}
          {booking.destination ? `To: ${booking.destination}` : ''}
        </Text>
      ) : null}

      {pricing ? (
        <Text style={styles.price}>
          Est. price:{' '}
          {formatIndianCurrencyRange(
            pricing.discountedTotalPriceRange.min,
            pricing.discountedTotalPriceRange.max,
          )}
        </Text>
      ) : null}

      <View style={styles.details}>
        <Text style={styles.detailText}>Phone: {booking.phone}</Text>
        {booking.email ? <Text style={styles.detailText}>Email: {booking.email}</Text> : null}
        {booking.vehicleType ? (
          <Text style={styles.detailText}>
            Vehicle: {booking.vehicleType === 'car' ? 'Car' : 'Auto'}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  tabs: { flexDirection: 'row', backgroundColor: colors.white },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: { borderBottomColor: colors.primaryBlue },
  tabText: { color: colors.gray500 },
  activeTabText: { color: colors.primaryBlue, fontWeight: '600' },
  list: { padding: 16 },
  emptyText: { textAlign: 'center', marginTop: 40, color: colors.gray500 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bookingId: { fontSize: 12, color: colors.gray500, fontWeight: '600' },
  createdAt: { fontSize: 11, color: colors.gray500, marginTop: 4 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  statusText: { color: colors.white, fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  address: { fontSize: 15, fontWeight: '600', color: colors.gray900, marginTop: 10 },
  route: { fontSize: 13, color: colors.gray700, marginTop: 6, lineHeight: 18 },
  price: { fontSize: 14, fontWeight: '600', color: colors.ctaGreenDark, marginTop: 8 },
  details: { marginTop: 10, gap: 4 },
  detailText: { fontSize: 13, color: colors.gray500 },
});
