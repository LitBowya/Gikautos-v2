import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../slices/cartSlice";
import FormContainer from "../components/Form/FormContainer";
import CheckoutSteps from "../components/Checkout Steps/CheckoutSteps";

const ShippingPage = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  // Initialize state with existing shipping address or empty values
  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [phoneNumber, setPhoneNumber] = useState(
    shippingAddress?.phoneNumber || ""
  );
  const [otherPhoneNumber, setOtherPhoneNumber] = useState(
    shippingAddress?.otherPhoneNumber || ""
  );
  const [additionalInformation, setAdditionalInformation] = useState(
    shippingAddress?.additionalInformation || ""
  );
  const [region, setRegion] = useState(shippingAddress?.region || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    // Dispatch action to save shipping address
    dispatch(
      saveShippingAddress({
        address,
        city,
        otherPhoneNumber,
        phoneNumber,
        additionalInformation,
        region,
      })
    );
    navigate("/payment");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />

      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="phoneNumber" className="my-2">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            required
            type="number"
            placeholder="Enter Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="otherPhoneNumber" className="my-2">
          <Form.Label>Other Phone Number</Form.Label>
          <Form.Control
            required
            type="number"
            placeholder="Enter Other Phone Number"
            value={otherPhoneNumber}
            onChange={(e) => setOtherPhoneNumber(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="region" className="my-2">
          <Form.Label>Region</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter Region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="city" className="my-2">
          <Form.Label>City</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="address" className="my-2">
          <Form.Label>GP Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter GP Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="additionalInformation" className="my-2">
          <Form.Label>Additional Information</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter additional information"
            value={additionalInformation}
            onChange={(e) => setAdditionalInformation(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" className="my-2">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingPage;
