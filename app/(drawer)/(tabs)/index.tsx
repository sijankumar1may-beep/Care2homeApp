import { Ionicons } from "@expo/vector-icons";
import { Image } from 'expo-image';
import { Link } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  BackHandler,
  Dimensions,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

const imageSource = require("@/assets/images/homepage.png");
const { width } = Dimensions.get("window");

export default function HomeHeroCard() {

  const openWhatsapp = () => {
    const phoneNumber = "919910646415";
    const message = "Hello, I want to book Care2Home service";
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch(() => {
      Alert.alert("WhatsApp not installed");
    });
  }

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to go back?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'YES', onPress: () => BackHandler.exitApp() },
      ]);
      return false;
    }
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  return (
    <ScrollView>
      <View style={styles.wrapper}>

        {/* HERO SECTION */}
        <View style={styles.hero}>
          <Text style={styles.title}>
            Parents arriving today or tomorrow?
          </Text>

          <Text style={styles.subtitle}>
            We personally receive them at the station/airport and drop them home safely —
            and also receive them at home and drop them to the station/airport.
          </Text>

          <View style={styles.imageBox}>
            <Ionicons name="people" size={48} color="#111827" />
          </View>

          <View style={styles.buttonRow}>
            <Link href={'/bookservice'} asChild>
              <Pressable style={styles.primaryBtn}>
                <Text style={styles.primaryBtnText}>Book Online</Text>
              </Pressable>
            </Link>

            <Pressable style={styles.secondaryBtn} onPress={openWhatsapp}>
              <Text style={styles.secondaryBtnText}>WhatsApp</Text>
            </Pressable>
          </View>

          <View style={{ padding: 16, marginTop: 10 }}>
            <Image
              source={imageSource}
              style={{ width: 280, height: 300, borderRadius: 20 }}
              contentFit='contain'
            />
          </View>
        </View>

        {/* TRUST INFO CARD */}
        <View style={styles.infoCard}>
          <InfoItem text="Background-verified companions" />
          <InfoItem text="Doorstep responsibility" />
          <InfoItem text="Live journey updates for family" />
          <InfoItem text="Wheelchair assistance available" />
          <InfoItem text="Emergency support throughout the journey" />
        </View>

        {/* HOW IT WORKS */}
        <View style={styles.howCard}>
          <Text style={styles.howTitle}>How Care2Home Works</Text>

          <HowStep icon="calendar-outline" text="Book the service online or via WhatsApp" />
          <HowStep icon="walk-outline" text="We receive your parents safely" />
          <HowStep icon="home-outline" text="Secure drop & live family updates" />
        </View>

      </View>
    </ScrollView>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function InfoItem({ text }: { text: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name="checkmark-circle" size={22} color="#16A34A" />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

function HowStep({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.howRow}>
      <Ionicons name={icon as any} size={20} color="#364153" />
      <Text style={styles.howText}>{text}</Text>
    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    flex: 1
  },

  hero: {
    backgroundColor: "#bedeff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },

  title: {
    color: "#000",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    color: "#000",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },

  imageBox: {
    marginVertical: 20,
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },

  primaryBtn: {
    backgroundColor: "#00a63e",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
  },

  primaryBtnText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },

  secondaryBtn: {
    borderWidth: 1.5,
    borderColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
  },

  secondaryBtnText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 15,
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    elevation: 4,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },

  howCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
  },

  howTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
  },

  howRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  howText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#374151",
  },
});
