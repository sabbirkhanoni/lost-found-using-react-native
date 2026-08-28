import Router from "express";
import { isAuthenticated } from "../middlewares/isAuthenticaed.js";
import {
  createItemController,
  getAllItemsController,
  getNearbyItemsController,
  getMyItemsController,
  getItemByIdController,
  updateItemStatusController,
  deleteItemController,
} from "../Controllers/item.controller.js";

const router = Router();

router.post("/", isAuthenticated, createItemController);
router.get("/", isAuthenticated, getAllItemsController);
router.get("/nearby", isAuthenticated, getNearbyItemsController); 
router.get("/mine", isAuthenticated, getMyItemsController);    
router.get("/:id", isAuthenticated, getItemByIdController);
router.patch("/:id/status", isAuthenticated, updateItemStatusController);
router.delete("/:id", isAuthenticated, deleteItemController);

export default router;