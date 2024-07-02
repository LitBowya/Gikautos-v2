import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const getMechanics = asyncHandler(async (req, res) => {
  const mechanics = await User.find({ isMechanic: true }).select(
    "name username email profilePicture isMechanic mechanicDetails reviews, numReviews"
  );

  // Check if mechanics were found
  if (mechanics && mechanics.length > 0) {
    res.status(200).json(mechanics);
  } else {
    res.status(404);
    throw new Error("Mechanics not found");
  }
});

const getMechanicById = asyncHandler(async (req, res) => {
  const mechanic = await User.findById(req.params.id);

  if (mechanic) {
    res.json(mechanic);
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

const createMechanicReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const mechanic = await User.findById(req.params.id);

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

export { getMechanics, getMechanicById, createMechanicReview };
