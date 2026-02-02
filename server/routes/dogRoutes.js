import express from "express";
import {
  createDog,
  getMyDog,
  updateDog,
} from "../controllers/dogController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createDog);
router.get("/me", protect, getMyDog);
router.put("/me", protect, updateDog);

export default router;
