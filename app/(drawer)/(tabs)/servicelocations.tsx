import React, { useState } from 'react';
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

/* ---------- Types ---------- */

type TabType = 'stations' | 'airports' | 'interchange';

type LocationItem = {
  id: string;
  name: string;
};

/* ---------- Mock Data ---------- */

const DATA: Record<TabType, LocationItem[]> = {
  stations: [
    { id: '1', name: 'New Delhi Railway Station' },
    { id: '2', name: 'Hazrat Nizamuddin Station' },
    { id: '3', name: 'Old Delhi Railway Station' },
    { id: '4', name: 'Anand Vihar Terminal' },
    { id: '5', name: 'Delhi Cantt Station' },
    { id: '6', name: 'Ghaziabad Junction' },
  ],
  airports: [
    { id: '1', name: 'Indira Gandhi International Airport' },
    { id: '2', name: 'Domestic Airport Delhi' },
  ],
  interchange: [
    { id: '1', name: 'Kashmere Gate ISBT' },
    { id: '2', name: 'Anand Vihar ISBT' },
  ],
};

/* ---------- Component ---------- */

export default function ServiceLocationsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('stations');

  return (
    <View style={styles.container}>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Tab label="Stations" value="stations" activeTab={activeTab} onPress={setActiveTab} />
        <Tab label="Airports" value="airports" activeTab={activeTab} onPress={setActiveTab} />
        <Tab label="Interchange" value="interchange" activeTab={activeTab} onPress={setActiveTab} />
      </View>

      {/* List */}
      <FlatList
        data={DATA[activeTab]}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.icon}>🚆</Text>
            <Text style={styles.cardText}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

/* ---------- Tab Component ---------- */

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
      style={[styles.tab, isActive && styles.activeTab]}
      onPress={() => onPress(value)}
    >
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {label}
      </Text>
    </Pressable>
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
    padding: 16,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
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
    fontSize: 14,
    color: '#6B7280',
  },
  activeTabText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 1,
  },
  icon: {
    fontSize: 22,
    marginRight: 12,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
