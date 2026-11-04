import React, { useState, useEffect } from 'react';
import OSMMapView from '../components/OSMMapView';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getItemByIdApi } from '../api/item.api';
import { Linking } from 'react-native';

const ItemDetailsScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await getItemByIdApi(id);
        setItem(response.data.item);
      } catch (error) {
        Alert.alert(
          'Error',
          error.response?.data?.message || 'Failed to load item',
        );
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  if (!item) return null;

  const isFound = item.type === 'found';
  const [longitude, latitude] = item.location.coordinates;

  const handleCall = () => {
    if (item.postedBy?.phone) {
      Linking.openURL(`tel:${item.postedBy.phone}`);
    } else {
      Alert.alert('Not available', "This user hasn't added a phone number");
    }
  };

  const handleEmail = () => {
    if (item.postedBy?.email) {
      Linking.openURL(
        `mailto:${item.postedBy.email}?subject=About your ${item.tagCode} post on Ferot`,
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Image header */}
      <View style={styles.imageHeader}>
        {item.images && item.images.length > 0 ? (
          <Image source={{ uri: item.images[0] }} style={styles.headerImage} />
        ) : (
          <View style={styles.headerPlaceholder}>
            <Text style={{ fontSize: 60 }}>{isFound ? '✅' : '❓'}</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text>←</Text>
        </TouchableOpacity>
        <View
          style={[
            styles.statusPill,
            isFound ? styles.pillFound : styles.pillLost,
          ]}
        >
          <Text style={isFound ? styles.pillTextFound : styles.pillTextLost}>
            {isFound ? '🟢 Found' : '🔴 Lost'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.tagCode}>#{item.tagCode}</Text>
          <Text style={styles.timeAgo}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <Text style={styles.title}>{item.title}</Text>

        <Text style={styles.sectionLabel}>Description / Hint</Text>
        <Text style={styles.description}>{item.description}</Text>

        <Text style={styles.sectionLabel}>Location</Text>

        <View style={styles.mapPreview}>
          <OSMMapView
            latitude={latitude}
            longitude={longitude}
            zoom={18}
            markers={[
              {
                id: item._id,
                latitude,
                longitude,
                color: isFound ? '#3e7bf6' : '#FF6B5B',
              },
            ]}
            interactive={true}
          />
          {item.location.address ? (
            <View style={styles.addressBadge}>
              <Text style={styles.addressText}>📍 {item.location.address}</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.sectionLabel}>Posted by</Text>
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.postedBy?.name?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
          <View>
            <Text style={styles.userName}>
              {item.postedBy?.name || 'Unknown'}
            </Text>
            <Text style={styles.userMeta}>{item.postedBy?.email}</Text>
          </View>
        </View>

        <View style={styles.contactRow}>
          <TouchableOpacity
            style={[styles.contactBtn, { backgroundColor: '#17B890' }]}
            onPress={handleCall}
          >
            <Text style={styles.contactBtnText}>📞 Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.contactBtn, { backgroundColor: '#6C5CE7' }]}
            onPress={handleEmail}
          >
            <Text style={styles.contactBtnText}>✉️ Email</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9FF' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  imageHeader: { height: 260, position: 'relative' },
  headerImage: { width: '100%', height: '100%' },
  headerPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ECE7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  contactRow: { flexDirection: 'row', gap: 10 },
  contactBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
  },
  contactBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  pillFound: { backgroundColor: '#E3FBF3' },
  pillLost: { backgroundColor: '#FFEDEB' },
  pillTextFound: { color: '#0F9B78', fontWeight: '800', fontSize: 11 },
  pillTextLost: { color: '#E4503F', fontWeight: '800', fontSize: 11 },
  content: { padding: 18 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagCode: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5641D8',
    backgroundColor: '#ECE7FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  timeAgo: { fontSize: 11, color: '#68678A' },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1B1B3A',
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B7B4CF',
    textTransform: 'uppercase',
    marginTop: 14,
    marginBottom: 6,
  },
  description: { fontSize: 13.5, color: '#68678A', lineHeight: 21 },
  mapPreview: {
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  addressBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  addressText: { fontSize: 10, fontWeight: '700', color: '#1B1B3A' },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#6C5CE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  userName: { fontWeight: '700', fontSize: 13.5, color: '#1B1B3A' },
  userMeta: { fontSize: 11, color: '#68678A' },
  chatBtn: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
  },
  chatBtnText: { color: '#fff', fontWeight: '700', fontSize: 14.5 },
});

export default ItemDetailsScreen;
