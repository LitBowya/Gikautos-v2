import express from "express";
import {
  getProducts,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getLatestProducts,
  getMostPurchasedProducts,
  getProductsByCategory,
  getBrands,
  getCategories,
  fetchProducts,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.get("/top", getTopProducts);
router.get("/latest", getLatestProducts);
router.get("/purchased", getMostPurchasedProducts);
router.get("/shop", getAllProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/brands/:category", getBrands);
router.get("/categories", getCategories);
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);
router.route("/:id/reviews").post(protect, createProductReview);
router.get("/allproducts", fetchProducts);

export default router;
