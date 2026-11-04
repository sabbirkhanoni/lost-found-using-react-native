import React, { useEffect } from "react";
import { OneSignal } from "react-native-onesignal";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { navigateFromNotification } from "./src/navigation/navigationRef";
import { initOneSignal } from "./src/utils/pushNotifications";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";


export default function App() {
  useEffect(() => {
    initOneSignal();

    // notification ট্যাপ করলে (foreground/background/killed — সব অবস্থাতেই কাজ করে)
    const handleClick = (event) => {
      const data = event.notification?.additionalData;
      if (!data?.viewItemId) return;

      navigateFromNotification("ItemDetails", {
        id: data.viewItemId,
        matchContext: data.myItemId
          ? { myItemId: data.myItemId, matchScore: Number(data.matchScore) }
          : undefined,
      });
    };

    OneSignal.Notifications.addEventListener("click", handleClick);

    return () => {
      OneSignal.Notifications.removeEventListener("click", handleClick);
    };
  }, []);

  return (
     <SafeAreaProvider>
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
    </SafeAreaProvider>
  );

};

const styles = StyleSheet.create({
  container: {
  },
});