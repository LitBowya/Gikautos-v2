import React, { useState } from "react";
import { Row, Col, Image, ListGroup, Button, Form, Container, Card } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useGetMechanicDetailsQuery, useCreateMechanicReviewMutation } from "../../slices/mechanicApiSlice";
import Loader from "../../components/Loader/Loader";
import Message from "../../components/Message/Message";
import Rating from "../../components/Rating/Rating";

const MechanicDetailPage = () => {
  const { id: mechanicId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo._id;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: mechanicDetails,
    isLoading,
    refetch,
    error,
  } = useGetMechanicDetailsQuery(mechanicId);

  const [createMechanicReview, { isLoading: loadingProductReview }] = useCreateMechanicReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createMechanicReview({ mechanicId, rating, comment }).unwrap();
      refetch();
      toast.success("Review created successfully");
      setComment("");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.error('Error creating review', err)
      refetch()
      setComment("");
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error || !mechanicDetails) {
    return (
      <Container>
        <Message variant="danger">{error?.data?.message || "Failed to fetch mechanic details"}</Message>
      </Container>
    );
  }

  // Ensure mechanicDetails.availableDays is defined before accessing
  const availableDays = mechanicDetails.mechanicDetails.availableDays || {};

  return (
    <Container>
      <Link className="btn btn-light my-3" to="/mechanic">
        Go Back
      </Link>
      <Card className="my-3">
        <Row className="g-0">
          <Col md={5}>
            <Image
              src={mechanicDetails.mechanicDetails.mechanicProfilePicture}
              alt={mechanicDetails.name}
              className="img-fluid rounded-start"
            />
          </Col>
          <Col md={7}>
            <Card.Body>
              <Card.Title>{mechanicDetails.name}</Card.Title>
              <Card.Text as="div">
                <Rating value={mechanicDetails.rating} text={`${mechanicDetails.numReviews} reviews`} />
              </Card.Text>
              <ListGroup variant="flush" className="my-3">
                <ListGroup.Item><strong>Specialty:</strong> {mechanicDetails.mechanicDetails.specialty}</ListGroup.Item>
                <ListGroup.Item><strong>Experience:</strong> {mechanicDetails.mechanicDetails.experience} years</ListGroup.Item>
                <ListGroup.Item><strong>Working Hours:</strong> {mechanicDetails.mechanicDetails.workingHours}</ListGroup.Item>
                <ListGroup.Item><strong>Contact Number:</strong> 0{mechanicDetails.mechanicDetails.contactNumber}</ListGroup.Item>
                <ListGroup.Item>
                  <strong>Services Provided:</strong> {mechanicDetails.mechanicDetails.servicesProvided ? mechanicDetails.mechanicDetails.servicesProvided.join(", ") : "Not specified"}
                </ListGroup.Item>
                <ListGroup.Item><strong>Additional Info:</strong> {mechanicDetails.mechanicDetails.additionalInfo}</ListGroup.Item>
                <ListGroup.Item>
                  <strong>Shop Address:</strong>
                  <ul>
                    <li>Region: {mechanicDetails.mechanicDetails.shopAddress?.region}</li>
                    <li>City: {mechanicDetails.mechanicDetails.shopAddress?.city}</li>
                    <li>Town: {mechanicDetails.mechanicDetails.shopAddress?.town}</li>
                    <li>Location: {mechanicDetails.mechanicDetails.shopAddress?.location}</li>
                  </ul>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Available Days:</strong>
                  <ul className="list-inline">
                    {Object.keys(availableDays).map((day) => (
                      <li key={day} className="list-inline-item me-3">
                        {day.charAt(0).toUpperCase() + day.slice(1)}: {availableDays[day] ? <FaCheck style={{ color: 'green' }} /> : <FaTimes style={{ color: 'red' }} />}
                      </li>
                    ))}
                  </ul>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Col>
        </Row>
      </Card>
      <Row className="my-3">
        <Col md={6}>
          <h2>Reviews</h2>
          {mechanicDetails.reviews.length === 0 && <Message>No Reviews</Message>}
          <ListGroup variant="flush">
            {mechanicDetails.reviews.map((review) => (
              <ListGroup.Item key={review._id}>
                <strong>{review.name}</strong>
                <Rating value={review.rating} />
                <p>{review.createdAt.substring(0, 10)}</p>
                <p>{review.comment}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={6}>
          <h2>Write a Customer Review</h2>
          {loadingProductReview && <Loader />}
          {userId === mechanicId ? (
            <Message variant="warning">You are not allowed to review yourself</Message>
          ) : (
            <Form onSubmit={submitHandler}>
              <Form.Group className="my-2" controlId="rating">
                <Form.Label>Rating</Form.Label>
                <Form.Control
                  as="select"
                  required
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </Form.Control>
              </Form.Group>
              <Form.Group className="my-2" controlId="comment">
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Button
                disabled={loadingProductReview}
                type="submit"
                variant="primary"
              >
                Submit
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MechanicDetailPage;
