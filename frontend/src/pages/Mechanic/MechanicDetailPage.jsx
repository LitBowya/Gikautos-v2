import React, { useState } from "react";
import {
  Row,
  Col,
  ListGroup,
  Container,
    ProgressBar,
  Card,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { FaCheck, FaTimes, FaStar, FaCheckCircle } from "react-icons/fa";
import {
  useGetMechanicByIdQuery,
  useCreateMechanicReviewMutation,
} from "../../slices/mechanicApiSlice";
import Loader from "../../components/Loader/Loader";
import Message from "../../components/Message/Message";
import Rating from "../../components/Rating/Rating";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ProductCss from "../ProductPage.module.css";

const MechanicDetailPage = () => {
  const { id: mechanicId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo._id;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showAllReviews, setShowAllReviews] = useState(false);

  const {
    data: mechanic,
    isLoading,
    refetch,
    error,
  } = useGetMechanicByIdQuery(mechanicId);

  const [createMechanicReview, { isLoading: loadingProductReview }] =
    useCreateMechanicReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createMechanicReview({ mechanicId, rating, comment }).unwrap();
      refetch();
      toast.success("Review created successfully");
      setComment("");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.error("Error creating review", err);
      refetch();
      setComment("");
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error || !mechanic) {
    return (
      <Container>
        <Message variant="danger">
          {error?.data?.message || "Failed to fetch mechanic details"}
        </Message>
      </Container>
    );
  }

  // Ensure mechanicDetails.availableDays is defined before accessing
  const availableDays = mechanic.mechanic.mechanicDetails.availableDays || {};

  const ratingCounts = Array(5).fill(0); // Array to count each rating from 1 to 5

  if (mechanic.mechanic && mechanic.mechanic.reviews) {
    // Ensure productSelected is defined
    mechanic.mechanic.reviews.forEach((review) => {
      ratingCounts[review.rating - 1] += 1;
    });
  }

  const averageRating =
    mechanic.mechanic.reviews.length > 0
      ? (
          mechanic.mechanic.reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / mechanic.mechanic.reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className={ProductCss.productPage}>
      <Container>
        <Link className="btn btn-light my-3" to="/mechanic">
          Go Back
        </Link>
        <Card className="my-3">
          <Row className="g-0">
            <Col md={5}>
              <LazyLoadImage
                src={mechanic.mechanic.mechanicDetails.mechanicProfilePicture}
                alt={mechanic.mechanic.name}
                className={`img-fluid rounded-start`}
                placeholderSrc="https://placehold.co/600x400"
              />
            </Col>
            <Col md={7}>
              <Card.Body>
                <Card.Title>{mechanic.mechanic.name}</Card.Title>
                <Card.Text as="div">
                  <Rating
                    value={mechanic.mechanic.rating}
                    text={`${mechanic.mechanic.numReviews} reviews`}
                  />
                </Card.Text>
                <ListGroup variant="flush" className="my-3">
                  <ListGroup.Item>
                    <strong>Specialty:</strong>{" "}
                    {mechanic.mechanic.mechanicDetails.specialty}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Experience:</strong>{" "}
                    {mechanic.mechanic.mechanicDetails.experience} years
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Working Hours:</strong>{" "}
                    {mechanic.mechanic.mechanicDetails.workingHours}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Contact Number:</strong> 0
                    {mechanic.mechanic.mechanicDetails.contactNumber}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Services Provided:</strong>{" "}
                    {mechanic.mechanic.mechanicDetails.servicesProvided
                      ? mechanic.mechanic.mechanicDetails.servicesProvided.join(
                          ", "
                        )
                      : "Not specified"}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Additional Info:</strong>{" "}
                    {mechanic.mechanic.mechanicDetails.additionalInfo}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Shop Address:</strong>
                    <ul>
                      <li>
                        Region:{" "}
                        {mechanic.mechanic.mechanicDetails.shopAddress?.region}
                      </li>
                      <li>
                        City:{" "}
                        {mechanic.mechanic.mechanicDetails.shopAddress?.city}
                      </li>
                      <li>
                        Town:{" "}
                        {mechanic.mechanic.mechanicDetails.shopAddress?.town}
                      </li>
                      <li>
                        Location:{" "}
                        {
                          mechanic.mechanic.mechanicDetails.shopAddress
                            ?.location
                        }
                      </li>
                    </ul>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Available Days:</strong>
                    <ul className="list-inline">
                      {Object.keys(availableDays).map((day) => (
                        <li key={day} className="list-inline-item me-3">
                          {day.charAt(0).toUpperCase() + day.slice(1)}:{" "}
                          {availableDays[day] ? (
                            <FaCheck style={{ color: "green" }} />
                          ) : (
                            <FaTimes style={{ color: "red" }} />
                          )}
                        </li>
                      ))}
                    </ul>
                  </ListGroup.Item>
                </ListGroup>

                <div className={ProductCss.reviews}>
                  <h2>Reviews</h2>
                  {mechanic.mechanic.reviews.length === 0 ? (
                    <Message>No Reviews</Message>
                  ) : (
                    <>
                      <ul className={ProductCss.reviewList}>
                        {(showAllReviews
                          ? mechanic.mechanic.reviews
                          : mechanic.mechanic.reviews.slice(0, 3)
                        ).map((review) => (
                          <li key={review._id}>
                            <strong>{review.name}</strong>
                            <div className={ProductCss.starRating}>
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
                          </li>
                        ))}
                      </ul>
                      {mechanic.mechanic.reviews.length > 3 && (
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

                  <Row className={ProductCss.writeReview}>
                    {/* Average Rating Section */}
                    <Col md={6}>
                      <div className={ProductCss.averageRating}>
                        <h3>Average Rating: {averageRating} / 5</h3>
                        {ratingCounts.map((count, index) => {
                          // Calculate the percentage
                          const percentage =
                            mechanic.mechanic.reviews.length > 0
                              ? (count / mechanic.mechanic.reviews.length) * 100
                              : 0;
                          // Round the percentage for display
                          const roundedPercentage = Math.round(percentage);

                          return (
                            <div key={index} className={ProductCss.raingBar}>
                              <span className={ProductCss.stars}>
                                {Array(index + 1)
                                  .fill(0)
                                  .map((_, i) => (
                                    <div className={ProductCss.star}>
                                      <FaStar key={i} color="orange" />
                                    </div>
                                  ))}
                              </span>
                              <span className={ProductCss.percentage}>
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
                      {userInfo ? (
                        <form onSubmit={submitHandler}>
                          <div className="mb-3">
                            <label
                              htmlFor="rating"
                              className="form-label fw-bold"
                            >
                              Rating
                            </label>
                            <div
                              className={`${ProductCss.starRating} d-flex align-items-center`}
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
                              className={ProductCss.submitButton}
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
                            userId === mechanicId && (
                              <Message variant="warning">
                                You are not allowed to review yourself
                              </Message>
                            )
                          )}
                        </>
                      )}
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
};

export default MechanicDetailPage;
