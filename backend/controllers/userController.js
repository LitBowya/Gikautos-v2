import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import OrderMechanic from "../models/orderMechanicModel.js";
import generateToken from "../utils/generateToken.js";
import { io } from '../config/socket.js'
import dotenv from "dotenv";
import axios from 'axios';

dotenv.config();

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id);

        res.json({
            _id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            profilePicture: user.profilePicture,
            isMechanic: user.isMechanic,
            mechanicDetails: user.isMechanic ? user.mechanicDetails : null,
            reviews: user.isMechanic ? user.reviews : null,
            numReviews: user.isMechanic ? user.numReviews : null,
            rating: user.isMechanic ? user.rating : null,
        });

    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

const registerUser = asyncHandler(async (req, res) => {
    const {
        name,
        username,
        email,
        password,
        profilePicture,
        isMechanic,
        mechanicDetails,
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const newUser = await User.create({
        name,
        username,
        email,
        password,
        isAdmin: false,
        profilePicture,
        isMechanic,
        mechanicDetails: isMechanic ? mechanicDetails : null,
        reviews: isMechanic ? [] : null,
    });

    if (newUser) {
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            username: newUser.username,
            email: newUser.email,
            profilePicture: newUser.profilePicture,
            isAdmin: newUser.isAdmin,
            isMechanic: newUser.isMechanic,
            mechanicDetails: newUser.isMechanic ? newUser.mechanicDetails : null,
            reviews: newUser.isMechanic ? newUser.reviews : null,
        });
        redirect('/login')
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});


const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({ message: "Logged out successfully" });
});

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.status(200).json({
            _id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            isAdmin: user.isAdmin,
            isMechanic: user.isMechanic,
            mechanicDetails: user.isMechanic ? user.mechanicDetails : null,
            reviews: user.isMechanic ? user.reviews : null,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});


const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }


        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            username: user.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(200);
        throw new Error("User not found");
    }
});

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.isAdmin) {
            res.status(400);
            throw new Error("Can not delete admin user");
        }
        await User.deleteOne({ _id: user._id });
        res.json({ message: "User removed" });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

const updateUserLocation = asyncHandler(async (req, res) => {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        res.status(400);
        throw new Error("Latitude and Longitude are required");
    }

    const user = await User.findById(req.user._id);
    if (user) {
        user.liveLocation = {
            type: "Point",
            coordinates: [longitude, latitude],
        };
        user.lastSeen = Date.now();
        await user.save();

        // Emit the updated location to all connected clients
        if (io) {
            const locationUpdate = {
                userId: req.user._id,
                coordinates: [longitude, latitude],
                lastSeen: user.lastSeen,
            }
            io.emit('locationUpdate', locationUpdate);
            console.log('Location updated', locationUpdate)
        }

        res.status(200).json({ message: "Location updated successfully" });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

const getNearbyMechanics = asyncHandler(async (req, res) => {
    const { latitude, longitude, maxDistance = 10000 } = req.query; // maxDistance in meters
    const geoapifyApiKey = process.env.GEOAPIFY_API_KEY;
    // Debugging: Log the retrieved coordinates
    console.log('Retrieved coordinates:', { latitude, longitude });

    try {
        // Construct the correct Geoapify URL using geocode/search
        const url = `https://api.geoapify.com/v1/geocode/search?text=mechanic&bias=proximity:${longitude},${latitude}&filter=circle:${longitude},${latitude},${maxDistance}&format=json&apiKey=${geoapifyApiKey}`;

        const response = await axios.get(url);

        // Query the database for mechanics based on the live location and maxDistance
        const mechanics = await User.find({
            isMechanic: true,
            liveLocation: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: Number(maxDistance),
                },
            },
        });

        if (mechanics.length > 0) {
            res.status(200).json({ mechanics, geoapifyResults: response.data });
        } else {
            res.status(200).json({ message: 'No mechanics found' });
        }
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500);
        throw new Error("Error fetching nearby mechanics");
    }
});

const placeOrder = asyncHandler(async (req, res) => {
    const { mechanicId, details, carName, carBrand, carColor, carPlateNumber } = req.body;

    // Input validation
    if (!mechanicId || !details || !carName || !carBrand || !carColor || !carPlateNumber) {
        res.status(400);
        throw new Error("Mechanic ID, order details, car name, brand, color, and plate number are required");
    }

    const carOwner = req.user._id;

    // Retrieve the carOwner's liveLocation
    const carOwnerUser = await User.findById(carOwner).select('liveLocation');

    if (!carOwnerUser || !carOwnerUser.liveLocation) {
        res.status(404);
        throw new Error("Car owner's location not found");
    }

    const mechanic = await User.findById(mechanicId);

    if (!mechanic) {
        res.status(404);
        throw new Error("Mechanic not found");
    }

    // Create the order object
    const order = {
        carOwner,
        mechanic: mechanicId,
        details,
        status: 'pending',
        carOwnerLocation: carOwnerUser.liveLocation, // Use carOwner's liveLocation
        mechanicLocation: mechanic.liveLocation,
        car: {
            name: carName,
            brand: carBrand,
            color: carColor,
            plateNumber: carPlateNumber,
        },
    };

    try {
        // Save the order to the database
        const newOrder = await OrderMechanic.create(order);

        // Notify mechanic with Socket.IO
        if (io) {
            io.to(mechanicId).emit('newOrder', {
                message: 'You have a new order!',
                order: newOrder
            });
        }

        res.status(201).json(newOrder);
    } catch (error) {
        // Error handling
        console.error('Error placing order:', error.message);
        res.status(500);
        throw new Error("Error placing order");
    }
});

export {
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
};
