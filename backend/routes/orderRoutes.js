import express from "express";
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOnDeliveryOrderToPaid,
  getOrders,
  getMyOrders,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, addOrderItems).get(protect, getOrders);
router.route("/mine").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/deliver").put(protect, updateOrderToDelivered);
router
  .route("/:id/payondelivery")
  .put(protect, updateOnDeliveryOrderToPaid);


export default router;
