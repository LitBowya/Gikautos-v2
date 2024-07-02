import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import MechanicCard from "../../components/Mechanic/MechanicCard";
import { useGetMechanicsQuery } from "../../slices/mechanicApiSlice";
import Loader from "../../components/Loader/Loader";
import Message from "../../components/Message/Message";

const MechanicHomepage = () => {
  const { data: users, isLoading, isError } = useGetMechanicsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Message variant="danger">Error loading mechanics</Message>;
  }

  return (
    <Container className="mechanic-homepage">
      <Row className="g-4">
        {users.map((mechanic) => (
          <Col key={mechanic._id} xs={6} md={4} lg={3} xl={2} >
            <MechanicCard mechanic={mechanic} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default MechanicHomepage;
