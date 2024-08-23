import { useState, useEffect } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  Tabs,
  Tab,
  Accordion, // Import Accordion
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import Message from "../components/Message/Message";
import Loader from "../components/Loader/Loader";
import { useProfileMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { formatDate } from "../utils/dateUtils";
import ProfileCss from "./ProfilePage.module.css";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null); // Track expanded order

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || "");
      setEmail(userInfo.email || "");
    }
  }, [userInfo, userInfo.name, userInfo.email]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else if (userInfo) {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();

        dispatch(setCredentials(res));
        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    } else {
      toast.error("User information is not available");
    }
  };

  return (
    <Container>
      <Tabs defaultActiveKey="profile" id="profile-tabs" className="mb-3">
        <Tab eventKey="profile" title="Profile">
          <div className={ProfileCss.profileContainer}>
            <Form onSubmit={submitHandler} className={ProfileCss.form}>
              <h3 className="text-center">User Profile</h3>
              <div className={ProfileCss.inputContainer}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={ProfileCss.inputField}
                />
                <span
                  className={`${ProfileCss.placeholder} ${
                    name ? ProfileCss.shrink : ""
                  }`}
                >
                  Name
                </span>
              </div>

              <div className={ProfileCss.inputContainer}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={ProfileCss.inputField}
                />
                <span
                  className={`${ProfileCss.placeholder} ${
                    email ? ProfileCss.shrink : ""
                  }`}
                >
                  Email Address
                </span>
              </div>

              <div className={ProfileCss.inputContainer}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={ProfileCss.inputField}
                />
                <span
                  className={`${ProfileCss.placeholder} ${
                    password ? ProfileCss.shrink : ""
                  }`}
                >
                  Password
                </span>
              </div>

              <div className={ProfileCss.inputContainer}>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={ProfileCss.inputField}
                />
                <span
                  className={`${ProfileCss.placeholder} ${
                    confirmPassword ? ProfileCss.shrink : ""
                  }`}
                >
                  Confirm Password
                </span>
              </div>

              <Button type="submit" className={ProfileCss.submitButton}>
                Update
              </Button>
              {loadingUpdateProfile && <Loader />}
            </Form>
            <Button className={ProfileCss.logoutButton} onClick={logoutHandler}>
              Logout
            </Button>
          </div>
        </Tab>

        <Tab eventKey="orders" title="Orders">
          <h4>My Orders</h4>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <Accordion>
              {orders.map((order) => (
                <Accordion.Item
                  key={order._id}
                  eventKey={order._id}
                  onClick={() =>
                    setExpandedOrderId(
                      expandedOrderId === order._id ? null : order._id
                    )
                  }
                >
                  <Accordion.Header>
                    <Row>
                      <Col>ID: {order._id}</Col>
                      <Col>Date: {formatDate(order.createdAt)}</Col>
                      <Col>Total: GHS {order.totalPrice.toFixed(2)}</Col>
                    </Row>
                  </Accordion.Header>
                  <Accordion.Body>
                    <p>
                      <strong>ID:</strong> {order._id}
                    </p>
                    <p>
                      <strong>Date:</strong> {formatDate(order.createdAt)}
                    </p>
                    <p>
                      <strong>Payment Method:</strong> {order.paymentMethod}
                    </p>
                    <p>
                      <strong>Total:</strong> GHS {order.totalPrice.toFixed(2)}
                    </p>
                    <p>
                      <strong>Paid:</strong>{" "}
                      {order.isPaid ? (
                        formatDate(order.paidAt)
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </p>
                    <p>
                      <strong>Delivered:</strong>{" "}
                      {order.isDelivered ? (
                        formatDate(order.deliveredAt)
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </p>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className="btn-sm" variant="primary">
                        Details
                      </Button>
                    </LinkContainer>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default ProfilePage;
