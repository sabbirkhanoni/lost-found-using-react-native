import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getAllItemsApi } from '../api/item.api';
import ItemCard from '../components/ItemCard';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Alert } from 'react-native';
const TABS = [
  {
    key: 'all',
    label: 'All',
    icon: 'apps-outline',
  },
  {
    key: 'found',
    label: 'Found',
    icon: 'checkmark-circle-outline',
  },
  {
    key: 'lost',
    label: 'Lost',
    icon: 'search-outline',
  },
];
const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const type = activeTab === 'all' ? undefined : activeTab;
      const response = await getAllItemsApi(type);
      setItems(response.data.items || []);
    } catch (error) {
      console.log('Failed to fetch items:', error.response?.data?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab]);
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);
  const handleRefresh = () => {
    setRefreshing(true);
    fetchItems();
  };
  const filteredItems = items.filter(item =>
    item?.title?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* HEADER */}

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.username} numberOfLines={1}>
            Hi, {user?.name || 'Welcome back'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={20} color="#e00808" />
          <View />
        </TouchableOpacity>
      </View>

      {/* SEARCH */}

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search lost or found items..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={19} color="#CBD5E1" />
          </TouchableOpacity>
        )}
      </View>

      {/* SECTION TITLE */}

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Community Items</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{filteredItems.length}</Text>
        </View>
      </View>

      {/* FILTER TABS */}

      <View style={styles.tabsRow}>
        {TABS.map(tab => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.8}
              style={[
                styles.tab,
                active ? styles.tabActive : styles.tabInactive,
              ]}
            >
              <Ionicons
                name={tab.icon}
                size={15}
                color={active ? '#FFFFFF' : '#64748B'}
              />
              <Text
                style={active ? styles.tabTextActive : styles.tabTextInactive}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ITEM LIST */}

      <FlatList
        data={filteredItems}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#4F46E5"
            colors={['#4F46E5']}
          />
        }
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            onPress={() =>
              navigation.navigate('ItemDetails', {
                id: item._id,
              })
            }
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <Ionicons name="cube-outline" size={34} color="#4F46E5" />
              </View>
              <Text style={styles.emptyTitle}>No items found</Text>
              <Text style={styles.emptySubtitle}>
                Be the first to post a lost or found item.
              </Text>
            </View>
          ) : null
        }
        contentContainerStyle={
          filteredItems.length === 0 ? styles.emptyList : styles.listContent
        }
      />
    </View>
  );
};
const styles = StyleSheet.create({
  /* 
     CONTAINER
  */
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  /* 
     HEADER
  */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerLeft: {
    flex: 1,
  },
  logoutBtn: {
    width: 44,
    height: 44,
    marginTop: 20,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutBtnText: {
    color: '#E4503F',
    fontWeight: '700',
    fontSize: 14,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  greeting: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  username: {
    marginTop: 22,
    color: '#0F172A',
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  notificationDot: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: '#EF4444',
    top: 10,
    right: 10,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  /* 
     SEARCH
  */
  searchBox: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 15,
    marginBottom: 5,
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: 9,
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '500',
  },
  /* 
     SECTION
  */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13,
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 3,
  },
  countBadge: {
    minWidth: 31,
    height: 31,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    color: '#4F46E5',
    fontSize: 11,
    fontWeight: '900',
  },
  /* ================
     TABS
  */
  tabsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 13,
    borderRadius: 11,
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#0F172A',
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 3,
  },
  tabInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  tabTextInactive: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
  },
  /* 
     LIST
  */
  listContent: {
    paddingBottom: 30,
  },
  /* 
     EMPTY
  */
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 70,
    paddingHorizontal: 35,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  emptyTitle: {
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 6,
  },
  emptySubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
export default HomeScreen;
