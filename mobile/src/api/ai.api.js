import axiosInstance from "./axiosInstance";

export const chatWithAiApi = (message, history) =>
  axiosInstance.post("/ai/chat", { message, history });