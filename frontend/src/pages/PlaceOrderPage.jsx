import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Container,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import Message from "../components/Message/Message";
import CheckoutSteps from "../components/Checkout Steps/CheckoutSteps";
import Loader from "../components/Loader/Loader";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import {
  useGetCartItemsQuery,
  useClearCartItemsMutation,
} from "../slices/cartApiSlice";
import PlaceOrderCss from './PlaceOrder.module.css'

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const { data: cartItems } = useGetCartItemsQuery();
  const [clearCartItems] = useClearCartItemsMutation();

  const calculateTotalItemPrice = () => {
    if (!cartItems || cartItems.length === 0) return 0;

    return cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  };

  const totalPrice = calculateTotalItemPrice() + cart.shippingPrice;

  const clearCartHandler = async () => {
    try {
      await clearCartItems();
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (!cart.shippingAddress) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingAddress, navigate]);

  const orderItems =
    cartItems &&
    cartItems.map((item) => ({
      _id: item._id,
      product: {
        _id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
      },
      qty: item.quantity,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
    }));

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: orderItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: calculateTotalItemPrice(),
        shippingPrice: cart.shippingPrice,
        totalPrice: totalPrice,
      }).unwrap();
      await clearCartHandler();
      navigate(`/order/${res._id}`);
    } catch (err) {
      console.error(err);
      toast.error(err);
    }
  };

  const orderNow = async () => {
    try {
      const res = await createOrder({
        orderItems: orderItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: calculateTotalItemPrice(),
        shippingPrice: cart.shippingPrice,
        totalPrice: totalPrice,
      }).unwrap();
      await clearCartHandler();
      navigate(`/order/${res._id}`);
    } catch (error) {
      console.error("Error", error);
      toast.error(error);
    }
  };

  return (
    <Container>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Full Name: </strong>
                {userInfo.name}
              </p>
              <p>
                <strong>Phone Number: </strong>
                {cart.shippingAddress.phoneNumber}
              </p>
              <p>
                <strong>Other Phone Number: </strong>
                {cart.shippingAddress.otherPhoneNumber}
              </p>
              <p>
                <strong>Region: </strong>
                {cart.shippingAddress.region}
              </p>
              <p>
                <strong>City: </strong>
                {cart.shippingAddress.city}
              </p>
              <p>
                <strong>Additional Information: </strong>
                {cart.shippingAddress.additionalInformation}
              </p>
              <p>
                <strong>GP Address: </strong>
                {cart.shippingAddress.address}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h4>Payment Method</h4>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h4>Order Items</h4>
              {cartItems && cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cartItems && (
                    <div>
                      {cartItems.map((item, index) => (
                        <ListGroup.Item key={index}>
                          <Row className="d-flex align-items-center">
                            <Col md={2}>
                              <Image
                                src={item.product.image}
                                alt={item.product.name}
                                fluid
                                rounded
                              />
                            </Col>
                            <Col>{item.product.name}</Col>
                            <Col md={4}>
                              {parseInt(item.quantity)} x GHS {item.product.price}{" "}
                              = GHS
                              {(
                                parseInt(item.quantity) * item.product.price
                              ).toFixed(2)}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </div>
                  )}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card
            style={{
              position: "sticky",
              top: "10px",
            }}
          >
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h4>Order Summary</h4>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>GHS {calculateTotalItemPrice().toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>GHS {cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>GHS {totalPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && (
                  <Message variant="danger">{error.data.message}</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                {cart.paymentMethod === "On Delivery" ? (
                  <Button
                    type="button"
                    className={PlaceOrderCss.button}
                    disabled={cartItems && cartItems === 0}
                    onClick={placeOrderHandler}
                  >
                    Order Now
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className={PlaceOrderCss.button}
                    disabled={cartItems && cartItems === 0}
                    onClick={orderNow}
                  >
                    Order Now
                  </Button>
                )}
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PlaceOrderPage;
