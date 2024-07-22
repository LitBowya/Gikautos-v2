import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/getwishlist", protect, getWishlist);
router.delete("/:id", protect, removeFromWishlist);
router.post("/addtowishlist", protect, addToWishlist);
router.put("/clearwishlist", protect, clearWishlist);

export default router;
