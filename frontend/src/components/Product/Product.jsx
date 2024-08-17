import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import Rating from "../Rating/Rating";
import { useAddToWishlistMutation } from "../../slices/wishlistSlice";
import { useAddToCartMutation } from "../../slices/cartApiSlice";
import Logo from "../Logo/Logo";
import ProductCss from "./Product.module.css";

const Product = ({ product }) => {
  const [addToWishlist] = useAddToWishlistMutation();
  const [addToCart] = useAddToCartMutation();

  const addToWishlistHandler = async () => {
    try {
      await addToWishlist({ productId: product._id }).unwrap();
      toast.success("Item added to wishlist successfully");
    } catch (error) {
      console.error("Failed to add to wishlist", error);
      toast.error("Failed to add to wishlist");
    }
  };

  const addToCartHandler = async () => {
    try {
      await addToCart({ productId: product._id, quantity: 1 }).unwrap();
      toast.success("Item added to cart successfully");
    } catch (error) {
      console.error("Failed to add to cart", error);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className={ProductCss.product}>
      {product.countInStock === 0 ? (
        <div
          style={{
            opacity: "0.4",
            pointerEvents: "none",
            cursor: "not-allowed",
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            className={ProductCss.productImg}
          />
          <div className={ProductCss.productInfo}>
            <div style={{ color: "gray" }}>
              <h3 className={ProductCss.productName}>{product.name}</h3>
            </div>
            <span>Out Of Stock</span>
            <p>${product.price}</p>
          </div>
        </div>
      ) : (
        <>
          <Link to={`/product/${product._id}`}>
            <img
              src={product.image}
              alt={product.name}
              className={ProductCss.productImg}
            />
          </Link>
          <div className={ProductCss.productInfo}>
            <Link to={`/product/${product._id}`} style={{ color: "black" }}>
              <h3 className={ProductCss.productName}>{product.name}</h3>
            </Link>
            <div>
              <Rating
                value={product.rating}
                text={`(${product.numReviews})`}
              />
            </div>
            <div className={ProductCss.productFooter}>
              <p>${product.price}</p>
              <div className={ProductCss.productCart}>
                <button onClick={addToWishlistHandler}>
                  <FaHeart />
                </button>
                <button onClick={addToCartHandler}>
                  <FaShoppingCart />
                </button>
              </div>
            </div>
            <div className={ProductCss.logo}>
              <Logo />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Product;
