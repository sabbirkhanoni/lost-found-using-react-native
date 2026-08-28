import ItemModel from "../models/item.model.js";

const generateTagCode = async () => {
  const count = await ItemModel.countDocuments();
  const number = (count + 1001).toString().padStart(4, "0");
  return `LF-${number}`;
};

export const createItemService = async (payload, userId) => {
  const { type, title, description, images, longitude, latitude, address } = payload;

  if (!type || !["lost", "found"].includes(type)) {
    throw new Error("Item type must be either 'lost' or 'found'");
  }
  if (!title || !description) {
    throw new Error("Title and description are required");
  }
  if (longitude === undefined || latitude === undefined) {
    throw new Error("Location coordinates are required");
  }

  const tagCode = await generateTagCode();

  const newItem = new ItemModel({
    tagCode,
    type,
    title,
    description,
    images: images || [],
    location: {
      type: "Point",
      coordinates: [Number(longitude), Number(latitude)],
      address,
    },
    postedBy: userId,
  });

  await newItem.save();
  return newItem;
};

export const getAllItemsService = async (filter = {}) => {
  const query = { status: "active" };
  if (filter.type) query.type = filter.type;

  return await ItemModel.find(query)
    .populate("postedBy", "name email")
    .sort({ createdAt: -1 });
};

export const getItemByIdService = async (itemId) => {
  const item = await ItemModel.findById(itemId).populate("postedBy", "name email");
  if (!item) {
    throw new Error("Item not found");
  }
  return item;
};

export const getMyItemsService = async (userId) => {
  return await ItemModel.find({ postedBy: userId }).sort({ createdAt: -1 });
};

export const updateItemStatusService = async (itemId, userId, status) => {
  if (!["active", "resolved", "closed"].includes(status)) {
    throw new Error("Invalid status value");
  }

  const item = await ItemModel.findById(itemId);
  if (!item) {
    throw new Error("Item not found");
  }
  if (item.postedBy.toString() !== userId.toString()) {
    throw new Error("You are not authorized to update this item");
  }

  item.status = status;
  await item.save();
  return item;
};

export const deleteItemService = async (itemId, userId) => {
  const item = await ItemModel.findById(itemId);
  if (!item) {
    throw new Error("Item not found");
  }
  if (item.postedBy.toString() !== userId.toString()) {
    throw new Error("You are not authorized to delete this item");
  }
  await ItemModel.findByIdAndDelete(itemId);
};

// ম্যাপে nearby pin দেখানো, পরে Matching Engine এও reuse হবে
export const findNearbyItemsService = async (longitude, latitude, maxDistanceInMeters, type) => {
  if (longitude === undefined || latitude === undefined) {
    throw new Error("Longitude and latitude are required");
  }

  const query = {
    status: "active",
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [Number(longitude), Number(latitude)] },
        $maxDistance: maxDistanceInMeters ? Number(maxDistanceInMeters) : 5000,
      },
    },
  };
  if (type) query.type = type;

  return await ItemModel.find(query).populate("postedBy", "name email");
};