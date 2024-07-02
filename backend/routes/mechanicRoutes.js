import express from "express";
import { getMechanics, getMechanicById, createMechanicReview } from "../controllers/mechanicController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", getMechanics)
router.get("/:id", getMechanicById)
router.post("/:id/reviews", protect, createMechanicReview);

export default router;
