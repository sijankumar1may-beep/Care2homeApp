import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";




type VehicleType = "auto" | "car";

const pricingTiers = [
  {
    range: "0-10 km",
    distanceKm: "0-10",
    auto: 599,
    car: 899,
    description: "Perfect for short local journeys",
  },
  {
    range: "10-20 km",
    distanceKm: "10-20",
    auto: 899,
    car: 1299,
    description: "Ideal for nearby areas",
    popular: true,
  },
  {
    range: "20-30 km",
    distanceKm: "20-30",
    auto: 1199,
    car: 1699,
    description: "For longer city travels",
  },
  {
    range: "30-50 km",
    distanceKm: "30-50",
    auto: 1599,
    car: 2199,
    description: "Extended journeys across NCR",
  },
  {
    range: "50+ km",
    distanceKm: "50+",
    auto: null,
    car: 2499,
    description: "Long distance travel (Car only)",
  },
];

export default function PricingSection() {
  const [vehicle, setVehicle] = useState<VehicleType>("car");
  const router = useRouter();
  const [toggleValue, setToggleValue] = useState(false);
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        {/* <Text style={styles.intro}>
          Most families book us when they can’t leave office or live in another
          city — and don’t want to take risks with their parents.
        </Text> */}

        <Text style={styles.title}>Simple, Transparent Pricing</Text>

        <Text style={styles.subTitle}>
          Choose your distance range and vehicle type. No hidden charges,
          complete care guaranteed.
        </Text>

        {/* VEHICLE TOGGLE */}
        <View style={styles.toggle}>
          <ToggleButtonWithMaterialIcons
            label="Auto"
            icon="taxi-sharp"
            active={vehicle === "auto"}
            onPress={() => setVehicle("auto")}
          />
          <ToggleButton
            label="Car"
            icon="car"
            active={vehicle === "car"}
            onPress={() => setVehicle("car")}
          />
        </View>

        <Text style={styles.meta}>
          Price includes Care Companion, vehicle & till-home assistance
        </Text>
      </View>

      {/* PRICING CARDS */}
      {pricingTiers.map((item, index) => {
        if (vehicle === "auto" && item.range === "50+ km") return null;
        let price = vehicle === 'auto' ? item.auto : item.car;
        return (
          <View
            key={index}
            style={[
              styles.card,
              item.popular && styles.popularCard,
            ]}
          >
            {item.popular && (
              <Text style={styles.popularBadge}>MOST POPULAR</Text>
            )}

            {vehicle === 'car' ? (
              <View style={styles.cardTitleRow}>
                <Ionicons name="car-sharp" size={22} color="#2563EB" />
                <Text style={styles.cardTitle}>{item.range}</Text>
              </View>
            ) : (
              <View style={styles.cardTitleRow}>
                <MaterialIcons name="electric-rickshaw" size={22} color="#2563EB" />
                <Text style={styles.cardTitle}>{item.range}</Text>
              </View>
            )}
            {/* <Text style={styles.cardTitle}>{vehicle === 'car' ? 'Car' : 'Auto'} {item.range}</Text> */}
            <Text style={styles.cardDesc}>{item.description}</Text>

            <Text style={styles.price}>₹{price}</Text>
            <Text style={styles.per}>per journey</Text>

            <Pressable
              style={styles.bookBtn}
              onPress={() =>
                router.push(
                  `/bookservice?distance=${item.distanceKm}&vehicle=${vehicle}&price=${price}`
                )
              }
            >
              <Text style={styles.bookText}>Book Pickup</Text>
            </Pressable>
          </View>
        );
      })}

      {/* INCLUDED SECTION */}
      <View style={styles.includedBox}>
        <View style={styles.includedHeader}>
          <Ionicons name="information-circle" size={24} color="#2563EB" />
          <View>
            <Text style={styles.includedTitle}>
              What&apos;s Included in Every Journey
            </Text>
            <Text style={styles.includedDesc}>
              Comprehensive care and safety features for every trip.
            </Text>
          </View>
        </View>

        {INCLUDES.map((item, index) => (
          <View key={index} style={styles.includeRow}>
            <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
            <Text style={styles.includeText}>{item}</Text>
          </View>
        ))}
      </View>

      {/* FOOT NOTE */}
      <Text style={styles.note}>
        Prices are fixed for the distance range. No surge pricing, no hidden
        charges.
      </Text>

      <Text style={styles.noteSmall}>
        Auto available up to 30 km. For longer journeys, Car is recommended.
      </Text>

    </ScrollView>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function ToggleButton({
  label,
  icon,
  active,
  onPress,
}: any) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.toggleBtn, active && styles.toggleActive]}
    >
      <Ionicons
        name={icon}
        size={18}
        color={active ? "#2563EB" : "#6B7280"}
      />
      <Text
        style={[styles.toggleText, active && styles.toggleTextActive]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ToggleButtonWithMaterialIcons({
  label,
  icon,
  active,
  onPress,
}: any) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.toggleBtn, active && styles.toggleActive]}
    >
      <MaterialIcons
        name='electric-rickshaw'
        size={18}
        color={active ? "#2563EB" : "#6B7280"}
      />
      <Text
        style={[styles.toggleText, active && styles.toggleTextActive]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const INCLUDES = [
  "Verified Care Companion",
  "Wheelchair Support",
  "Live Journey Tracking",
  "Help with Luggage & Stairs",
  "Till Home Safety Promise",
  "Real-time Updates to Family",
  "24/7 Emergency Support",
];

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFFFFF",
  },

  header: {
    alignItems: "center",
    marginBottom: 24,
  },

  intro: {
    fontSize: 15,
    color: "#374151",
    textAlign: "center",
    marginBottom: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  subTitle: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 16,
  },

  toggle: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },

  toggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  toggleActive: {
    backgroundColor: "#FFFFFF",
  },

  toggleText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },

  toggleTextActive: {
    color: "#2563EB",
  },

  meta: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },

  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },

  popularCard: {
    borderColor: "#2563EB",
    transform: [{ scale: 1.02 }],
  },

  popularBadge: {
    position: "absolute",
    top: -10,
    backgroundColor: "#2563EB",
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },

  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 8,
  },

  cardDesc: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },

  price: {
    fontSize: 36,
    fontWeight: "800",
    color: "#2563EB",
  },

  per: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 12,
  },

  bookBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
  },

  bookText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  includedBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
  },

  includedHeader: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  includedTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  includedDesc: {
    fontSize: 13,
    color: "#4B5563",
  },

  includeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },

  includeText: {
    fontSize: 14,
    color: "#374151",
  },

  note: {
    textAlign: "center",
    color: "#4B5563",
    marginTop: 20,
  },

  noteSmall: {
    textAlign: "center",
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
});
