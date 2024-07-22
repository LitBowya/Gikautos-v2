import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import Rating from "../Rating/Rating";
import { useAddToWishlistMutation } from "../../slices/wishlistSlice";
import { useAddToCartMutation } from "../../slices/cartApiSlice";

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
  const addToCarttHandler = async () => {
    try {
      await addToCart({ productId: product._id, quantity: 1 }).unwrap();
      toast.success("Item added to cart successfully");
    } catch (error) {
      console.error("Failed to add to cart", error);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <Card className="my-3 rounded" style={{ height: "300px" }}>
      {product.countInStock === 0 ? (
        <>
          <div
            style={{
              textDecoration: "none",
              filter: "grayscale",
              opacity: "0.4",
              pointerEvents: "none",
              cursor: "not-allowed",
            }}
          >
            <Card.Img
              src={product.image}
              variant="top"
              style={{ height: "200px" }}
              className="p-1"
            />
            <Card.Body className="p-2">
              <div
                style={{
                  textDecoration: "none",
                  color: "gray",
                }}
              >
                <Card.Title as="div" className="product-title">
                  <span>{product.name}</span>
                </Card.Title>
              </div>
              <span>Out Of Stock</span>
              <Card.Text as="p">${product.price}</Card.Text>
            </Card.Body>
          </div>
        </>
      ) : (
        <>
          <Link to={`/product/${product._id}`}>
            <Card.Img
              src={product.image}
              variant="top"
              className="p-1"
              style={{ height: "180px" }}
            />
          </Link>
          <Card.Body className="p-2">
            <Link
              to={`/product/${product._id}`}
              style={{
                textDecoration: "none",
                color: "orange",
              }}
            >
              <Card.Title as="div" className="product-title">
                <span>{product.name}</span>
              </Card.Title>
            </Link>
            <Card.Text as="div">
              <Rating
                value={product.rating}
                text={`${product.numReviews} reviews`}
              />
            </Card.Text>
            <Card.Text as="p">${product.price}</Card.Text>

            <FaHeart onClick={addToWishlistHandler} />
            <FaShoppingCart onClick={addToCarttHandler} />
          </Card.Body>
        </>
      )}
    </Card>
  );
};

export default Product;
