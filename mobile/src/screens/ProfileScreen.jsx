import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getMyItemsApi } from '../api/item.api';
import ItemCard from '../components/ItemCard';

const ProfileScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMyItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMyItemsApi();
      setMyItems(response.data.items);
    } catch (error) {
      console.log('Failed to fetch your items:', error.response?.data?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMyItems();
  }, [fetchMyItems]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMyItems();
  };

  const activeCount = myItems.filter(i => i.status === 'active').length;
  const resolvedCount = myItems.filter(i => i.status === 'resolved').length;

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      ListHeaderComponent={
        <>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{activeCount}</Text>
              <Text style={styles.statLabel}>Active Posts</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: '#0F9B78' }]}>
                {resolvedCount}
              </Text>
              <Text style={styles.statLabel}>Resolved</Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>My Posts</Text>
        </>
      }
      data={myItems}
      keyExtractor={item => item._id}
      renderItem={({ item }) => (
        <ItemCard
          item={item}
          onPress={() => navigation.navigate('ItemDetails', { id: item._id })}
        />
      )}
      ListEmptyComponent={
        !loading ? (
          <Text style={styles.emptyText}>You haven't posted anything yet</Text>
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9FF' },
  profileHeader: { alignItems: 'center', marginBottom: 16 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#6C5CE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 26 },
  name: { fontSize: 17, fontWeight: '800', color: '#1B1B3A' },
  email: { fontSize: 12, color: '#68678A', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    elevation: 2,
  },
  statNumber: { fontSize: 20, fontWeight: '800', color: '#1B1B3A' },
  statLabel: { fontSize: 10.5, color: '#68678A', marginTop: 2 },
  sectionLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#B7B4CF',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  emptyText: { textAlign: 'center', color: '#68678A', marginVertical: 20 },
});

export default ProfileScreen;
