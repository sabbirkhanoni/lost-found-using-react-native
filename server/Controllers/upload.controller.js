export const uploadImageController = async (request, response) => {
  try {
    if (!request.file) {
      return response.status(400).json({
        message: "No image file provided",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Image uploaded successfully",
      error: false,
      success: true,
      url: request.file.path, // Cloudinary URL
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Image upload failed",
      error: true,
      success: false,
    });
  }
};

export const uploadMultipleImagesController = async (request, response) => {
  try {
    if (!request.files || request.files.length === 0) {
      return response.status(400).json({
        message: "No image files provided",
        error: true,
        success: false,
      });
    }

    const urls = request.files.map((file) => file.path);

    return response.status(200).json({
      message: "Images uploaded successfully",
      error: false,
      success: true,
      urls,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Image upload failed",
      error: true,
      success: false,
    });
  }
};