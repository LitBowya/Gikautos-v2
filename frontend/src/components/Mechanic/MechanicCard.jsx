import React from "react";
import Rating from "../Rating/Rating";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetMechanicDetailsQuery } from "../../slices/mechanicApiSlice";

const MechanicCard = ({ mechanic }) => {
  const {
    data: mechanicDetails,
  } = useGetMechanicDetailsQuery(mechanic._id);

  return (
    <Card className="my-3 rounded" style={{ height: "300px" }}>
      <div>
        <Link to={`/mechanic/${mechanic._id}`}>
          <Card.Img
            src={mechanic.mechanicDetails.mechanicProfilePicture}
            variant="top"
            className="p-1"
            style={{ height: "180px" }}
          />
        </Link>

        <Card.Body className="p-2">
          <Link
            to={`/mechanic/${mechanic._id}`}
            style={{
              textDecoration: "none",
              color: "black",
            }}
          >
            <Card.Title as="div" className="product-title">
              <span>{mechanic.name}</span>
            </Card.Title>
          </Link>

          <Card.Text as="div">
            <Rating
              value={mechanicDetails?.rating}
              text={`${mechanic.numReviews} reviews`}
            />
          </Card.Text>

          <Card.Text as="p">{mechanic.mechanicDetails.specialty}</Card.Text>
        </Card.Body>
      </div>
    </Card>
  );
};

export default MechanicCard;
