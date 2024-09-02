import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Button,
  Container,
} from "react-bootstrap";
import { toast } from "react-toastify";
import Message from "../components/Message/Message";
import Loader from "../components/Loader/Loader";
import PageLoader from "../components/Loader/PageLoader";
import PayStack from "../components/PayStack/PayStack";
import VerifyPayment from "../components/PayStack/VerifyPayment";
import {
  useGetOrderDetailsQuery,
  useDeliverOrderMutation,
  usePayOnDeliveryOrderMutation,
} from "../slices/ordersApiSlice";
import { formatDate } from "../utils/dateUtils.js";

const OrderPage = () => {
  const { id: orderId } = useParams();

  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useGetOrderDetailsQuery(orderId);

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const [payOnDeliveryOrder, { isLoading: loadingPayOnDelivery }] =
    usePayOnDeliveryOrderMutation();

  const deliverOrderHandler = async () => {
    try {
      const orderDeliver = await deliverOrder(orderId);
      if (orderDeliver.data.isDelivered === true) {
        toast.success("Order Delivered Successfully");
        refetch();
      }
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  const payOnDeliveryOrderHandler = async () => {
    try {
      const payOnDelivery = await payOnDeliveryOrder(orderId);
      if (payOnDelivery.data.isPaid === true) {
        toast.success("Order Paid Successfully");
        refetch();
      }
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  return isLoading ? (
    <PageLoader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Container>
      <h2>Order Id {order._id}</h2>
      <Row>
        <Col md={8}>
          <ListGroup>
            <ListGroup.Item>
              <h3>Shipping</h3>
              <p>
                <strong>Name: {order.user.name}</strong>
              </p>
              <p>
                <strong>Email: {order.user.email}</strong>
              </p>
              <p>
                <strong>Full Name: </strong>
                {userInfo.name}
              </p>
              <p>
                <strong>Phone Number: </strong>
                {order.shippingAddress.phoneNumber}
              </p>
              <p>
                <strong>Other Phone Number: </strong>
                {order.shippingAddress.otherPhoneNumber}
              </p>
              <p>
                <strong>Region: </strong>
                {order.shippingAddress.region}
              </p>
              <p>
                <strong>City: </strong>
                {order.shippingAddress.city}
              </p>
              <p>
                <strong>Additional Information: </strong>
                {order.shippingAddress.additionalInformation}
              </p>
              <p>
                <strong>GP Address: </strong>
                {order.shippingAddress.address}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {formatDate(order.deliveredAt)}
                </Message>
              ) : (
                <Message variant="danger">Not delivered</Message>
              )}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <Button
                    type="button"
                    className="btn btn-block"
                    onClick={deliverOrderHandler}
                  >
                    Mark As Delivered
                  </Button>
                )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h6>Payment Method</h6>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">
                  Paid on {formatDate(order.paidAt)}
                </Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
              {userInfo &&
                userInfo.isAdmin && !order.isPaid &&
                order.paymentMethod === "On Delivery" && (
                  <Button
                    type="button"
                    className="btn btn-block"
                    onClick={payOnDeliveryOrderHandler}
                  >
                    Mark As Paid
                  </Button>
                )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h6>Order Items</h6>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row className="d-flex align-items-center">
                        <Col md={2}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <span>{item.name}</span>
                        </Col>
                        <Col md={4}>
                          {item.qty} x GHS {item.price} = GHS{" "}
                          {item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
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
                <h6>Order Summary</h6>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>GHS {order.itemsPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>GHS {order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>GHS {order.totalPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {order.paymentMethod === "PayStack" ? (
                  <div>
                    {order.isPaid && !userInfo.isAdmin ? (
                      <div>
                        <Message>Thank You For Shopping At GIKautos</Message>
                        <Button variant="info" className="btn-block w-100">
                          <Link
                            to="/"
                            style={{
                              textDecoration: "none",
                              color: "white",
                            }}
                          >
                            Continue Shopping
                          </Link>
                        </Button>
                        {loadingDeliver && <Loader />}
                        {loadingPayOnDelivery && <Loader />}
                      </div>
                    ) : (
                      <div>
                        {userInfo && (
                          <>
                            <PayStack /> <VerifyPayment orderId={orderId} />
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {userInfo ? null : (
                      <div>
                        <Message variant="success">
                          Thank You For Shopping With GIKautos
                        </Message>
                        <Button className="btn-block w-100">
                          <Link
                            to="/"
                            style={{
                              textDecoration: "none",
                              color: "white",
                            }}
                          >
                            Continue Shopping
                          </Link>
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderPage;
