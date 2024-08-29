import express from 'express';
import {
    getMechanics,
    getMechanicById,
    createMechanicReview,
    getFilteredMechanics,
    getFilterOptions
} from '../controllers/mechanicController.js';

const router = express.Router();

router.route('/').get(getMechanics); // For fetching all mechanics
router.route('/filter').get(getFilteredMechanics); // For filtering mechanics
router.route('/filters').get(getFilterOptions); // For filtering mechanics
router.route('/:id').get(getMechanicById); // For fetching mechanic by ID
router.route('/:id/reviews').post(createMechanicReview); // For creating a review

export default router;
