import express from 'express';
import {
    getMechanics,
    getMechanicById,
    createMechanicReview,
    getFilteredMechanics,
    getFilterOptions,
    updateOrderStatus,
    getOrdersForMechanic,
    clearLiveLocation
} from '../controllers/mechanicController.js';
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Fetch all mechanics
router.route('/').get(getMechanics);

// Fetch filtered mechanics
router.route('/filter').get(getFilteredMechanics);

// Fetch filter options
router.route('/filters').get(getFilterOptions);

// Get orders for the logged-in mechanic
router.route('/orders').get(protect, getOrdersForMechanic);

// Update order status (admin/authorized access might be needed based on your security needs)
router.route('/orders/status').put(protect, updateOrderStatus);


// Clear live location for the logged-in mechanic
router.route('/orders/clear-location').put(protect, clearLiveLocation);

// Fetch mechanic by ID
router.route('/:id').get(getMechanicById);

// Create a review for a mechanic
router.route('/:id/reviews').post(protect, createMechanicReview);



export default router;
