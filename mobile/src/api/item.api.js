import axiosInstance from './axiosInstance';

export const createItemApi = (payload) => axiosInstance.post("/item", payload);

export const getAllItemsApi = (type) =>
  axiosInstance.get("/item", { params: type ? { type } : {} });

export const getNearbyItemsApi = (params) => axiosInstance.get("/item/nearby", { params });

export const getMyItemsApi = () => axiosInstance.get("/item/mine");

export const getItemByIdApi = (id) => axiosInstance.get(`/item/${id}`);

export const updateItemStatusApi = (id, status) =>
  axiosInstance.patch(`/item/${id}/status`, { status });

export const deleteItemApi = (id) => axiosInstance.delete(`/item/${id}`);