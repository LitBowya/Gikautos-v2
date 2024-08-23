import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCheckCircle, FaStar, FaRegHeart, FaCartPlus } from "react-icons/fa";
import { Row, Col, Container, ProgressBar } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../slices/productsApiSlice";
import { useAddToCartMutation } from "../slices/cartApiSlice";
import { useAddToWishlistMutation } from "../slices/wishlistSlice";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";
import Rating from "../components/Rating/Rating";
import Loader from "../components/Loader/Loader";
import Message from "../components/Message/Message";
import ProductPageCss from "./ProductPage.module.css";

const ProductPage = () => {
  const { id: productId } = useParams();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const [addToCartItems] = useAddToCartMutation();
  const [addToWishlist] = useAddToWishlistMutation();

  const {
    data: productSelected,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const { data: orders } = useGetMyOrdersQuery();

  const { userInfo } = useSelector((state) => state.auth);

  let productNumber = null;

  if (orders) {
    orders.forEach((order) => {
      if (order.orderItems && order.orderItems.length > 0) {
        order.orderItems.forEach((orderItem) => {
          if (orderItem.product === productId) {
            productNumber = orderItem.product;
          }
        });
      }
    });
  }

  const ratingCounts = Array(5).fill(0); // Array to count each rating from 1 to 5

  if (productSelected && productSelected.reviews) {
    // Ensure productSelected is defined
    productSelected.reviews.forEach((review) => {
      ratingCounts[review.rating - 1] += 1;
    });
  }

  const totalReviews = productSelected?.reviews?.length || 0;
  const averageRating =
    totalReviews > 0
      ? (
          productSelected.reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / totalReviews
        ).toFixed(1)
      : 0;

  // Task 1: Truncate description logic
  let truncatedDescription = ""; // Declare the variable outside the if block

  if (productSelected && productSelected.description) {
    truncatedDescription = productSelected.description.slice(0, 200);
  }

  const addToCartHandler = async () => {
    try {
      await addToCartItems({
        productId: productSelected._id,
        quantity: qty,
      });
      refetch();
      toast.success("Item added to cart successfully");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  const addToWishlistHandler = async () => {
    try {
      await addToWishlist({
        productId: productSelected._id,
      });
      refetch();
      toast.success("Item added to wishlist successfully");
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
      toast.error("Failed to add item to wishlist");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
      setComment("");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className={ProductPageCss.productPage}>
      <Container>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <>
            <Row>
              <Col lg={5}>
                <img
                  src={productSelected.image}
                  alt={productSelected.name}
                  className={ProductPageCss.productImage}
                />
              </Col>
              <Col lg={7}>
                <div className={ProductPageCss.productInfo}>
                  <h3>{productSelected.name}</h3>
                  <Rating
                    value={productSelected.rating}
                    text={`${productSelected.numReviews} reviews`}
                  />
                  <p className={ProductPageCss.productPrice}>
                    Price: GHS {productSelected.price}
                  </p>
                  <p
                    className={ProductPageCss.productStatus}
                    style={{
                      fontWeight:
                        productSelected.countInStock > 0 ? "bold" : "bold",
                      fontStyle:
                        productSelected.countInStock <= 0 ? "italic" : "normal",
                      color:
                        productSelected.countInStock > 0 ? "green" : "gray",
                      textDecoration:
                        productSelected.countInStock <= 0
                          ? "line-through"
                          : "none",
                    }}
                  >
                    {productSelected.countInStock > 0
                      ? "In Stock"
                      : "Out Of Stock"}
                  </p>
                  <div>
                    <p className={ProductPageCss.productDescription}>
                      Description:{" "}
                      {showFullDescription ||
                      productSelected.description.length <= 100
                        ? productSelected.description
                        : truncatedDescription}
                      {productSelected.description.length > 100 && (
                        <Link
                          to="#"
                          onClick={() =>
                            setShowFullDescription(!showFullDescription)
                          }
                        >
                          {showFullDescription ? " Show Less" : " Show More"}
                        </Link>
                      )}
                    </p>
                  </div>

                  {productSelected.countInStock > 0 && (
                    <div className={ProductPageCss.productQuantity}>
                      <div className={ProductPageCss.qty}>Qty</div>

                      <div className={`${ProductPageCss.qtyAction} d-flex`}>
                        <div
                          className={`${ProductPageCss.qtyControl}`}
                          onClick={() => setQty(qty > 1 ? qty - 1 : qty)}
                        >
                          {" "}
                          -{" "}
                        </div>
                        <select
                          className="form-select"
                          as="select"
                          value={qty}
                          onChange={(e) => setQty(Number(e.target.value))}
                        >
                          {[...Array(productSelected.countInStock).keys()].map(
                            (x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            )
                          )}
                        </select>
                        <div
                          className={ProductPageCss.qtyControl}
                          onClick={() =>
                            setQty(
                              qty < productSelected.countInStock ? qty + 1 : qty
                            )
                          }
                        >
                          {" "}
                          +{" "}
                        </div>
                      </div>
                    </div>
                  )}

                  {productSelected.specifics &&
                  Object.keys(productSelected.specifics).length > 0 ? (
                    <div className={ProductPageCss.productSpecifics}>
                      <p>Specifications</p>
                      <ul>
                        {Object.entries(productSelected.specifics).map(
                          ([key, value]) => (
                            <li
                              className={ProductPageCss.productSpecific}
                              key={key}
                            >
                              <strong className={ProductPageCss.key}>
                                {key}
                              </strong>{" "}
                              <span className={ProductPageCss.value}>
                                {value}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  ) : (
                    <p>No specifics found</p>
                  )}

                  <div className={ProductPageCss.buttons}>
                    <button
                      onClick={addToWishlistHandler}
                      disabled={productSelected.countInStock === 0}
                    >
                      <FaRegHeart size={20} /> Add To Wishlist
                    </button>
                    <button
                      onClick={addToCartHandler}
                      disabled={productSelected.countInStock === 0}
                    >
                      <FaCartPlus size={20} /> Add To Cart
                    </button>
                  </div>
                </div>

                <div className={ProductPageCss.reviews}>
                  <h2>Reviews</h2>
                  {totalReviews === 0 ? (
                    <Message>No Reviews</Message>
                  ) : (
                    <>
                      <ul className={ProductPageCss.reviewList}>
                        {(showAllReviews
                          ? productSelected.reviews
                          : productSelected.reviews.slice(0, 3)
                        ).map((review) => (
                          <li key={review._id}>
                            <strong>{review.name}</strong>
                            <div className={ProductPageCss.starRating}>
                              {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                  <FaStar
                                    key={i}
                                    color={
                                      i < review.rating ? "#ffc107" : "#e4e5e9"
                                    }
                                  />
                                ))}
                            </div>
                            <p>{review.createdAt.substring(0, 10)}</p>
                            <p>{review.comment}</p>
                            <span className={ProductPageCss.verifiedPurchase}>
                              <FaCheckCircle /> Verified Purchase
                            </span>
                          </li>
                        ))}
                      </ul>
                      {totalReviews > 3 && (
                        <Link
                          to="#"
                          onClick={() => setShowAllReviews(!showAllReviews)}
                        >
                          {showAllReviews
                            ? "Hide Reviews"
                            : "Show More Reviews"}
                        </Link>
                      )}
                    </>
                  )}

                  <Row className={ProductPageCss.writeReview}>
                    {/* Average Rating Section */}
                    <Col md={6}>
                      <div className={ProductPageCss.averageRating}>
                        <h3>Average Rating: {averageRating} / 5</h3>
                        {ratingCounts.map((count, index) => {
                          // Calculate the percentage
                          const percentage =
                            totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                          // Round the percentage for display
                          const roundedPercentage = Math.round(percentage);

                          return (
                            <div
                              key={index}
                              className={ProductPageCss.raingBar}
                            >
                              <span className={ProductPageCss.stars}>
                                {Array(index + 1)
                                  .fill(0)
                                  .map((_, i) => (
                                    <div className={ProductPageCss.star}>
                                      <FaStar key={i} color="orange" />
                                    </div>
                                  ))}
                              </span>
                              <span className={ProductPageCss.percentage}>
                                <ProgressBar
                                  now={percentage}
                                  label={`${roundedPercentage}%`}
                                  variant="warning" // Use Bootstrap's built-in "warning" variant for an orange color
                                  style={{ backgroundColor: "#eee" }} // Apply a custom orange color
                                />
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </Col>

                    {/* Write a Review Section */}
                    <Col md={6}>
                      <h3 className="">Write a Customer Review</h3>
                      {loadingProductReview && <Loader />}
                      {userInfo && productId === productNumber ? (
                        <form onSubmit={submitHandler}>
                          <div className="mb-3">
                            <label
                              htmlFor="rating"
                              className="form-label fw-bold"
                            >
                              Rating
                            </label>
                            <div
                              className={`${ProductPageCss.starRating} d-flex align-items-center`}
                            >
                              {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                  <FaStar
                                    key={i}
                                    onClick={() => setRating(i + 1)}
                                    color={i < rating ? "#ffc107" : "#e4e5e9"}
                                    style={{
                                      cursor: "pointer",
                                      fontSize: "1.5rem",
                                    }}
                                    className="me-2"
                                  />
                                ))}
                            </div>
                          </div>
                          <div className="mb-3">
                            <label
                              htmlFor="comment"
                              className="form-label fw-bold"
                            >
                              Comment
                            </label>
                            <textarea
                              id="comment"
                              className="form-control"
                              rows="4"
                              required
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                          </div>
                          <div className="d-flex justify-content-end">
                            <button
                              type="submit"
                              className={ProductPageCss.submitButton}
                              disabled={loadingProductReview}
                            >
                              Submit
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          {!userInfo ? (
                            <Message variant="warning">
                              Please <Link to="/login">sign in</Link> to write a
                              review
                            </Message>
                          ) : (
                            productId !== productNumber && (
                              <Message variant="warning">
                                Kindly make a purchase in order to review
                              </Message>
                            )
                          )}
                        </>
                      )}
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default ProductPage;
