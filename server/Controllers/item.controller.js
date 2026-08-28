import {
  createItemService,
  getAllItemsService,
  getItemByIdService,
  getMyItemsService,
  updateItemStatusService,
  deleteItemService,
  findNearbyItemsService,
} from "../services/item.service.js";

export const createItemController = async (request, response) => {
  try {
    const item = await createItemService(request.body, request.userId);
    return response.status(201).json({
      message: "Item posted successfully",
      error: false,
      success: true,
      item,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Failed to post item",
      error: true,
      success: false,
    });
  }
};

export const getAllItemsController = async (request, response) => {
  try {
    const { type } = request.query;
    const items = await getAllItemsService({ type });
    return response.status(200).json({
      message: "Items fetched successfully",
      error: false,
      success: true,
      items,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Failed to fetch items",
      error: true,
      success: false,
    });
  }
};

export const getNearbyItemsController = async (request, response) => {
  try {
    const { longitude, latitude, distance, type } = request.query;
    const items = await findNearbyItemsService(longitude, latitude, distance, type);
    return response.status(200).json({
      message: "Nearby items fetched successfully",
      error: false,
      success: true,
      items,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Failed to fetch nearby items",
      error: true,
      success: false,
    });
  }
};

export const getMyItemsController = async (request, response) => {
  try {
    const items = await getMyItemsService(request.userId);
    return response.status(200).json({
      message: "Your items fetched successfully",
      error: false,
      success: true,
      items,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Failed to fetch your items",
      error: true,
      success: false,
    });
  }
};

export const getItemByIdController = async (request, response) => {
  try {
    const item = await getItemByIdService(request.params.id);
    return response.status(200).json({
      message: "Item fetched successfully",
      error: false,
      success: true,
      item,
    });
  } catch (error) {
    return response.status(404).json({
      message: error.message || "Item not found",
      error: true,
      success: false,
    });
  }
};

export const updateItemStatusController = async (request, response) => {
  try {
    const item = await updateItemStatusService(
      request.params.id,
      request.userId,
      request.body.status,
    );
    return response.status(200).json({
      message: "Item status updated successfully",
      error: false,
      success: true,
      item,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Failed to update item status",
      error: true,
      success: false,
    });
  }
};

export const deleteItemController = async (request, response) => {
  try {
    await deleteItemService(request.params.id, request.userId);
    return response.status(200).json({
      message: "Item deleted successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Failed to delete item",
      error: true,
      success: false,
    });
  }
};