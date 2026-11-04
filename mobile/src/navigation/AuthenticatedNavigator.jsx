import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainTabNavigator from "./MainTabNavigator";
import PostItemScreen from "../screens/PostItemScreen";
import ItemDetailsScreen from "../screens/ItemDetailsScreen";
import AiChatScreen from "../screens/AiChatScreen";

const Stack = createNativeStackNavigator();

const AuthenticatedNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="PostItem" component={PostItemScreen} />
      <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} />
      <Stack.Screen name="AiChat" component={AiChatScreen} />
    </Stack.Navigator>
  );
};

export default AuthenticatedNavigator;