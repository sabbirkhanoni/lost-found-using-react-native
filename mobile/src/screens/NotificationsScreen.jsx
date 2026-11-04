import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import {
  getNotificationsApi,
  markNotificationReadApi,
} from '../api/notification.api';

const ICONS = {
  match: { emoji: '✨', bg: '#FFF4DE' },
  nearby: { emoji: '📍', bg: '#E3FBF3' },
  resolved: { emoji: '🎉', bg: '#ECE7FF' },
  system: { emoji: '🔔', bg: '#F1F0FA' },
};

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await getNotificationsApi();
      setNotifications(response.data.notifications);
    } catch (error) {
      console.log(
        'Failed to fetch notifications:',
        error.response?.data?.message,
      );
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handlePress = async notification => {
    if (!notification.isRead) {
      markNotificationReadApi(notification._id).catch(() => {});
      setNotifications(prev =>
        prev.map(n =>
          n._id === notification._id ? { ...n, isRead: true } : n,
        ),
      );
    }

    const { viewItemId, myItemId, matchScore } = notification.data || {};
    if (viewItemId) {
      navigation.navigate('ItemDetails', {
        id: viewItemId,
        matchContext: myItemId ? { myItemId, matchScore } : undefined,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text>←</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        renderItem={({ item }) => {
          const icon = ICONS[item.type] || ICONS.system;
          return (
            <TouchableOpacity
              style={[styles.card, !item.isRead && styles.cardUnread]}
              onPress={() => handlePress(item)}
            >
              <View style={[styles.iconBox, { backgroundColor: icon.bg }]}>
                <Text style={{ fontSize: 16 }}>{icon.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.body}>{item.body}</Text>
                <Text style={styles.time}>
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
              </View>
              {!item.isRead && <View style={styles.dot} />}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notifications yet</Text>
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FF',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E7E4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: { fontSize: 18, fontWeight: '800', color: '#1B1B3A' },
  card: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
    backgroundColor: '#F5F3FF',
    alignItems: 'flex-start',
  },
  cardUnread: { backgroundColor: '#ECE7FF' },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontWeight: '700', fontSize: 12.5, color: '#1B1B3A' },
  body: { fontSize: 11, color: '#68678A', marginTop: 2, lineHeight: 16 },
  time: { fontSize: 9.5, color: '#B7B4CF', marginTop: 4 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B5B',
    marginTop: 4,
  },
  emptyText: { textAlign: 'center', color: '#68678A', marginTop: 40 },
});

export default NotificationsScreen;
