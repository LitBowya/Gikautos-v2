import express from "express";
import {
    loginUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserById,
    deleteUser,
    updateUser,
    updateUserLocation,
    getNearbyMechanics,
    placeOrder
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { uploadSingleImage } from "./uploadRoutes.js";

const router = express.Router();

// Routes for users
router.route("/").get(protect, getUsers); // Get all users (protected, adjust if needed)
router.post("/register", uploadSingleImage, registerUser); // Register a new user
router.post("/logout", logoutUser); // Logout user
router.post("/login", loginUser); // Login user

// Route for updating user location
router.put("/updateLocation", protect, updateUserLocation); // Update user location (protected)

// Route for getting nearby mechanics
router.get("/nearbyMechanics", protect, getNearbyMechanics); // Get nearby mechanics (protected)

// Route for placing an order
router.post("/placeOrder", protect, placeOrder); // Place an order (protected)
router
    .route("/profile")
    .get(protect, getUserProfile) // Get profile (protected)
    .put(protect, updateUserProfile); // Update profile (protected)


// Routes for specific users by ID
router
    .route("/:id")
    .delete(protect, admin, deleteUser) // Delete user by ID (admin protected)
    .put(protect, admin, updateUser) // Update user by ID (admin protected)
    .get(protect, admin, getUserById);


export default router;
