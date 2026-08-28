import Router from "express";
import upload from "../middlewares/upload.js";
import { isAuthenticated } from "../middlewares/isAuthenticaed.js";
import {
  uploadImageController,
  uploadMultipleImagesController,
} from "../Controllers/upload.controller.js";

const router = Router();

router.post("/single", isAuthenticated, upload.single("image"), uploadImageController);
router.post("/multiple", isAuthenticated, upload.array("images", 5), uploadMultipleImagesController);

export default router;