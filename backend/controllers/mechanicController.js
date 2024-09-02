import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Fetch mechanics with filtering and sorting
const getMechanics = asyncHandler(async (req, res) => {
    try {
        const mechanics = await User.find({ isMechanic: true })
        if (!mechanics) {
            console.log('Mechanics not found')
            res.status(404).json({ message: 'Mechanics not found' });
        }
        res.status(200).json({ status: 'success', message: 'Mechanics fetched successfully', mechanics })
    } catch (error) {

    }
});

const getMechanicById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    try {
        const mechanic = await User.findById(id);

        if (!mechanic || !mechanic.isMechanic) {
            return res.status(404).json({ message: "Mechanic not found" });
        }

        res.status(200).json({
            status: 'success',
            message: 'Mechanic fetched successfully',
            mechanic
        });
    } catch (error) {
        console.error("Error fetching mechanic by ID:", error.message);
        res.status(500).json({ message: "Server error while fetching mechanic" });
    }
});


const createMechanicReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    console.log("User Info:", req.user)
    const mechanic = await User.findById(req.params.id);

    if (!req.user) {
        res.status(401);
        throw new Error("User not authenticated");
    }



    if (mechanic) {
        const alreadyReviewed = mechanic.reviews.find(
            (review) => review.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error("mechanic already reviewed");
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        mechanic.reviews.push(review);

        mechanic.numReviews = mechanic.reviews.length;

        mechanic.rating =
            mechanic.reviews.reduce((acc, item) => item.rating + acc, 0) /
            mechanic.reviews.length;

        await mechanic.save();
        res.status(201).json({ message: "Review added successfully" });
    } else {
        res.status(404);
        throw new Error("mechanic not found");
    }
});

const getFilteredMechanics = asyncHandler(async (req, res) => {
    try {
        const {
            specialties,
            regions,
            cities,
            towns,
            workingHours,
            experienceMin,
            experienceMax,
            sortBy
        } = req.query;

        console.log("Query parameters:", req.query); // Log incoming query parameters

        let query = { isMechanic: true };

        if (specialties) {
            query['mechanicDetails.specialty'] = { $in: specialties.split(',') };
        }
        if (regions) {
            query['mechanicDetails.shopAddress.region'] = { $in: regions.split(',') };
        }
        if (cities) {
            query['mechanicDetails.shopAddress.city'] = { $in: cities.split(',') };
        }
        if (towns) {
            query['mechanicDetails.shopAddress.town'] = { $in: towns.split(',') };
        }
        if (workingHours) {
            query['mechanicDetails.workingHours'] = { $in: workingHours.split(',') };
        }
        if (experienceMin || experienceMax) {
            query['mechanicDetails.experience'] = {};
            if (experienceMin) {
                query['mechanicDetails.experience']['$gte'] = experienceMin;
            }
            if (experienceMax) {
                query['mechanicDetails.experience']['$lte'] = experienceMax;
            }
        }

        // Handle sorting
        let sort = {};
        if (sortBy === 'rating') {
            sort['rating'] = -1;
        } else if (sortBy === 'experience') {
            sort['mechanicDetails.experience'] = -1;
        } else {
            sort['createdAt'] = -1;
        }

        const mechanics = await User.find(query).sort(sort);

        if (mechanics.length === 0) {
            return res.status(404).json({ message: 'No mechanics found with the given criteria' });
        }

        res.status(200).json({
            status: 'success',
            message: 'Mechanics fetched successfully',
            mechanics
        });
    } catch (error) {
        console.error("Error fetching filtered mechanics:", error.message);
        res.status(500).json({ message: "Error fetching filtered mechanics" });
    }
});

const getFilterOptions = asyncHandler(async (req, res) => {
    try {
        const specialties = await User.distinct("mechanicDetails.specialty");
        const regions = await User.distinct("mechanicDetails.shopAddress.region");
        const cities = await User.distinct("mechanicDetails.shopAddress.city");
        const towns = await User.distinct("mechanicDetails.shopAddress.town");
        const workingHours = await User.distinct("mechanicDetails.workingHours");

        res.status(200).json({
            specialties,
            regions,
            cities,
            towns,
            workingHours
        });
    } catch (error) {
        console.error("Error fetching filter options:", error.message);
        res.status(500).json({ message: "Server error while fetching filter options" });
    }
});

export { getMechanics, getMechanicById, createMechanicReview, getFilteredMechanics, getFilterOptions };
