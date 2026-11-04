import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Ionicons from '@react-native-vector-icons/ionicons';

import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

// Colors

const COLORS = {
  primary: '#4F46E5',
  primaryLight: '#EEF2FF',

  text: '#0F172A',
  secondaryText: '#64748B',
  inactive: '#94A3B8',

  white: '#FFFFFF',
  border: '#E2E8F0',
};

// Center FAB

const CenterButton = () => {
  const navigation = useNavigation();

  const [isOpen, setIsOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    const nextValue = isOpen ? 0 : 1;

    setIsOpen(!isOpen);

    Animated.spring(animation, {
      toValue: nextValue,
      friction: 7,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  const handleAction = type => {
    handlePress();

    setTimeout(() => {
      if (type === 'found') {
        navigation.navigate('PostItem', {
          type: 'found',
        });
      }

      if (type === 'lost') {
        navigation.navigate('PostItem', {
          type: 'lost',
        });
      }

      if (type === 'ai') {
        navigation.navigate('AiChat');
      }
    }, 150);
  };

  return (
    <View style={styles.fabContainer}>
      {/* ACTION BUTTONS */}

      <Animated.View
        style={[
          styles.actionsRow,
          {
            opacity: animation,
            transform: [
              {
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
              {
                scale: animation,
              },
            ],
          },
        ]}
      >
        {/* FOUND */}

        <View style={styles.actionItem}>
          <TouchableOpacity
            style={[styles.actionButton, styles.foundButton]}
            activeOpacity={0.85}
            onPress={() => handleAction('found')}
          >
            <Ionicons name="checkmark-circle" size={25} color={COLORS.white} />
          </TouchableOpacity>

          <Text style={styles.actionLabel}>Found</Text>
        </View>

        {/* LOST */}

        <View style={styles.actionItem}>
          <TouchableOpacity
            style={[styles.actionButton, styles.lostButton]}
            activeOpacity={0.85}
            onPress={() => handleAction('lost')}
          >
            <Ionicons name="search" size={25} color={COLORS.white} />
          </TouchableOpacity>

          <Text style={styles.actionLabel}>Lost</Text>
        </View>

        {/* AI */}

        <View style={styles.actionItem}>
          <TouchableOpacity
            style={[styles.actionButton, styles.aiButton]}
            activeOpacity={0.85}
            onPress={() => handleAction('ai')}
          >
            <Ionicons name="sparkles" size={25} color={COLORS.white} />
          </TouchableOpacity>

          <Text style={styles.actionLabel}>AI</Text>
        </View>
      </Animated.View>

      {/* MAIN FAB */}

      <TouchableOpacity
        style={styles.fabWrapper}
        onPress={handlePress}
        activeOpacity={0.85}
      >
        <Animated.View
          style={[
            styles.fab,
            {
              transform: [
                {
                  rotate: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '45deg'],
                  }),
                },
              ],
            },
          ]}
        >
          <Ionicons name="add" size={29} color={COLORS.white} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};


// Premium Tab Icon


const TabIcon = ({ focused, activeIcon, inactiveIcon }) => {
  return (
    <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
      <Ionicons
        name={focused ? activeIcon : inactiveIcon}
        size={21}
        color={focused ? COLORS.primary : COLORS.inactive}
      />
    </View>
  );
};


// Main Tab Navigator


const MainTabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarStyle: [
          styles.tabBar,
          {
            height: 70 + insets.bottom,
            paddingBottom: 8 + insets.bottom,
          },
        ],

        tabBarShowLabel: true,

        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.inactive,

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: -1,
        },

        tabBarItemStyle: {
          paddingTop: 4,
        },
      }}
    >
      {/* =======
          HOME
      ======= */}

      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Home',

          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeIcon="home"
              inactiveIcon="home-outline"
            />
          ),
        }}
      />

      {/* =======
          MAP
      ======= */}

      <Tab.Screen
        name="MapTab"
        component={MapScreen}
        options={{
          title: 'Map',

          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeIcon="map"
              inactiveIcon="map-outline"
            />
          ),
        }}
      />

      {/* =======
          CENTER ACTION
      ======= */}

      <Tab.Screen
        name="PostAction"
        component={View}
        options={{
          tabBarLabel: () => null,

          tabBarButton: () => <CenterButton />,
        }}
        listeners={{
          tabPress: e => {
            e.preventDefault();
          },
        }}
      />

      {/* =======
          NOTIFICATIONS
      ======= */}

      <Tab.Screen
        name="NotificationsTab"
        component={NotificationsScreen}
        options={{
          title: 'Alerts',

          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeIcon="notifications"
              inactiveIcon="notifications-outline"
            />
          ),
        }}
      />

      {/* =======
          PROFILE
      ======= */}

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Profile',

          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeIcon="person"
              inactiveIcon="person-outline"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};


// Styles


const styles = StyleSheet.create({
  // =========
  // FAB Container
  // =========

  fabContainer: {
    width: 74,
    height: 70,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    zIndex: 20,
  },

  // =========
  // Action Row
  // =========

  actionsRow: {
    position: 'absolute',
    bottom: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 230,
    gap: 14,
    zIndex: 30,
  },

  actionItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionButton: {
    width: 50,
    height: 50,

    borderRadius: 25,

    alignItems: 'center',
    justifyContent: 'center',

    elevation: 7,

    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 7,
  },

  foundButton: {
    backgroundColor: '#16A34A',
  },

  lostButton: {
    backgroundColor: '#EF4444',
  },

  aiButton: {
    backgroundColor: '#7C3AED',
  },

  actionLabel: {
    marginTop: 4,

    fontSize: 10,
    fontWeight: '800',

    color: COLORS.text,

    backgroundColor: COLORS.white,

    paddingHorizontal: 6,
    paddingVertical: 2,

    borderRadius: 5,

    elevation: 2,
  },

  // =========
  // Bottom Navigation
  // =========

  tabBar: {
    backgroundColor: COLORS.white,

    borderTopWidth: 1,
    borderTopColor: COLORS.border,

    paddingTop: 7,

    elevation: 12,

    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },

  // =========
  // Icon
  // =========

  iconContainer: {
    width: 40,
    height: 30,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 11,
  },

  activeIconContainer: {
    backgroundColor: COLORS.primaryLight,
  },

  // =========
  // FAB Wrapper
  // =========

  fabWrapper: {
    width: 74,
    height: 70,

    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  // =========
  // FAB
  // =========

  fab: {
    width: 58,
    height: 58,

    borderRadius: 19,

    backgroundColor: COLORS.primary,

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: -23,

    borderWidth: 4,
    borderColor: COLORS.white,

    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.28,
    shadowRadius: 12,

    elevation: 9,
  },
});

export default MainTabNavigator;
