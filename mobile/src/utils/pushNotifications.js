import { OneSignal } from 'react-native-onesignal';

const ONESIGNAL_APP_ID = 'YOUR_ONESIGNAL_APP_ID';

export const initOneSignal = () => {
  OneSignal.initialize(ONESIGNAL_APP_ID);
  OneSignal.Notifications.requestPermission(true);
};

// after login, link the user to OneSignal
export const linkOneSignalUser = userId => {
  OneSignal.login(userId.toString());
};

export const unlinkOneSignalUser = () => {
  OneSignal.logout();
};
