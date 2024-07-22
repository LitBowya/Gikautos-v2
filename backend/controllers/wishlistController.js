import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";

// Get all items in the user's wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const wishlists = [];

  for (const wishlist of user.wishlists) {
    const product = await Product.findById(wishlist.product);

    if (product) {
      wishlists.push({
        _id: wishlist._id,
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          countInStock: product.countInStock,
        },
      });
    }
  }

  res.status(200).json(wishlists);
});

// Add a product to the user's wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const product = await Product.findById(productId);

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  // Check if the item already exists in the wishlist
  const existingItem = user.wishlists.find(
    (item) => item.product.toString() === productId
  );

  if (!existingItem) {
    // If the item does not exist in the wishlist, add it
    user.wishlists.push({ product: productId });
  }

  await user.save();

  const wishlistItem = {
    _id: existingItem ? existingItem._id : null,
    product: {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      countInStock: product.countInStock,
    },
  };

  res.status(200).json({
    success: true,
    message: "Item added to wishlist successfully",
    wishlistItem,
  });
});

// Remove a product from the user's wishlist
const removeFromWishlist = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Find the index of the wishlist item with the given product ID
  const wishlistIndex = user.wishlists.findIndex(
    (item) => item.product.toString() === productId
  );

  if (wishlistIndex !== -1) {
    // Remove the item from the wishlist array
    user.wishlists.splice(wishlistIndex, 1);
    await user.save();
    res.json({
      message: "Item removed from wishlist",
      wishlists: user.wishlists,
    });
  } else {
    return res
      .status(404)
      .json({ success: false, message: "Item not found in wishlist" });
  }
});

// Clear all items from the user's wishlist
const clearWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  user.wishlists = [];
  await user.save();

  res.status(200).json({
    message: "Wishlist cleared successfully",
    wishlists: user.wishlists,
  });
});

export { getWishlist, addToWishlist, removeFromWishlist, clearWishlist };
