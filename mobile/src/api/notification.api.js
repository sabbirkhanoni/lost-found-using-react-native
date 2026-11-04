import axiosInstance from "./axiosInstance";

export const getNotificationsApi = () => axiosInstance.get("/notification");

export const markNotificationReadApi = (id) => axiosInstance.patch(`/notification/${id}/read`);