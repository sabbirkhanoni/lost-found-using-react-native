import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAuth } from "../context/AuthContext";

import SplashScreen from "../screens/SplashScreen";
import AuthenticatedNavigator from "./AuthenticatedNavigator";
import UnauthenticatedNavigator from "./UnauthenticatedNavigator";

const AppNavigator = () => {
  const { token, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasSeenSplash = await AsyncStorage.getItem("hasSeenSplash");

      setShowSplash(!hasSeenSplash);
    };

    checkFirstLaunch();
  }, []);

  if (loading || showSplash === null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer>
      {token ? <AuthenticatedNavigator /> : <UnauthenticatedNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
