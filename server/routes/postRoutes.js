import express from "express";
import {
  createPost,
  getPosts,
  toggleLike,
} from "../controllers/postController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", protect, createPost);
router.post("/:id/like", protect, toggleLike);

export default router;
