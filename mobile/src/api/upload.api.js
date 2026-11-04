import axiosInstance from "./axiosInstance";

export const uploadImageApi = (imageUri) => {
  const formData = new FormData();
  formData.append("image", {
    uri: imageUri,
    type: "image/jpeg",
    name: `item_${Date.now()}.jpg`,
  });

  return axiosInstance.post("/upload/single", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};