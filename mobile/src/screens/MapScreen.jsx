import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import OSMMapView from '../components/OSMMapView';
import { getAllItemsApi } from '../api/item.api';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'found', label: '🟢 Found' },
  { key: 'lost', label: '🔴 Lost' },
];

const DEFAULT_CENTER = { latitude: 23.7808, longitude: 90.2792 };

const MapScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchItems();
    Geolocation.getCurrentPosition(
      position => {
        setCenter({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {},
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }, []);

  const fetchItems = async () => {
    try {
      const response = await getAllItemsApi();
      setItems(response.data.items);
    } catch (error) {
      console.log('Failed to fetch items:', error.response?.data?.message);
    }
  };

  const filteredItems = items.filter(
    item => activeTab === 'all' || item.type === activeTab,
  );

  const markers = filteredItems.map(item => ({
    id: item._id,
    latitude: item.location.coordinates[1],
    longitude: item.location.coordinates[0],
    color: item.type === 'found' ? '#17B890' : '#FF6B5B',
  }));

  const handleMarkerPress = id => {
    const found = filteredItems.find(item => item._id === id);
    setSelectedItem(found || null);
  };

  return (
    <View style={styles.container}>
      <OSMMapView
        key={`${center.latitude}-${center.longitude}-${filteredItems.length}-${activeTab}`}
        latitude={center.latitude}
        longitude={center.longitude}
        zoom={14}
        markers={markers}
        onMarkerPress={handleMarkerPress}
      />

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={[
              styles.tab,
              activeTab === tab.key ? styles.tabActive : styles.tabInactive,
            ]}
          >
            <Text
              style={
                activeTab === tab.key
                  ? styles.tabTextActive
                  : styles.tabTextInactive
              }
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Selected item preview */}
      {selectedItem && (
        <View style={styles.previewCard}>
          <View style={styles.previewThumb}>
            <Text style={{ fontSize: 22 }}>
              {selectedItem.type === 'found' ? '✅' : '❓'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.previewTitle} numberOfLines={1}>
              {selectedItem.title}
            </Text>
            <Text style={styles.previewMeta}>
              📍 {selectedItem.location.address || 'Unknown'} ·{' '}
              {selectedItem.type === 'found' ? 'Found' : 'Lost'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.previewArrow}
            onPress={() =>
              navigation.navigate('ItemDetails', { id: selectedItem._id })
            }
          >
            <Text style={{ color: '#6C5CE7', fontWeight: '800' }}>→</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBox: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  searchInput: { flex: 1, color: '#1B1B3A' },
  tabsRow: {
    position: 'absolute',
    top: 66,
    left: 16,
    flexDirection: 'row',
    gap: 6,
  },
  tab: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  tabActive: { backgroundColor: '#1B1B3A' },
  tabInactive: { backgroundColor: '#fff' },
  tabTextActive: { color: '#fff', fontWeight: '700', fontSize: 10.5 },
  tabTextInactive: { color: '#68678A', fontWeight: '700', fontSize: 10.5 },
  previewCard: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  previewThumb: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#ECE7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewTitle: { fontWeight: '700', fontSize: 13.5, color: '#1B1B3A' },
  previewMeta: { fontSize: 10.5, color: '#68678A', marginTop: 2 },
  previewArrow: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#ECE7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MapScreen;
