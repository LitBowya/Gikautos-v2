import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Button,
  Card,
  Container,
} from "react-bootstrap";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import { toast } from "react-toastify";
import {
  useGetCartItemsQuery,
  useRemoveFromCartMutation,
  useClearCartItemsMutation,
  useUpdateCartItemMutation,
} from "../slices/cartApiSlice";
import Message from "../components/Message/Message";
import Loader from "../components/Loader/Loader";
import CartPageCss from "./CartPage.module.css";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    data: cartItems,
    isLoading: cartItemsLoading,
    refetch,
  } = useGetCartItemsQuery();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [clearCartItems, { loading: clearCartLoading, isError, error }] =
    useClearCartItemsMutation();

  const [updateCartItem] = useUpdateCartItemMutation();

  useEffect(() => {
    refetch();
  }, [cartItems, refetch]);

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  const removeItemHandler = async (productId) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      try {
        await removeFromCart(productId);
        refetch();
        toast.success("Item removed from cart");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    }
  };

  const updateCartItemQuantity = async (productId, quantity) => {
    try {
      await updateCartItem({ productId, quantity });
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  const clearCartItemsHandler = async () => {
    if (window.confirm("Are you sure you want to clear the cart?")) {
      try {
        await clearCartItems();
        refetch();
        toast.success("Cart cleared");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    }
  };

  const subtotal = cartItems
    ? cartItems.reduce(
        (acc, item) => acc + item.quantity * item.product.price,
        0
      )
    : 0;
  const totalItems = cartItems
    ? cartItems.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  return (
    <Container>
      <div className={CartPageCss.cartPage}>
        <Row>
          <Col md={8} className={CartPageCss.cartItems}>
            <div
              className={`d-flex justify-content-between align-items-center py-2`}
            >
              <h2 className="my-2">Shopping Cart</h2>
              {clearCartLoading ? (
                <Loader />
              ) : (
                <div className="">
                  <span
                    className="d-block bg-danger p-3 rounded-3 pointer"
                    onClick={clearCartItemsHandler}
                  >
                    <FaTrash size={20} color="white" />
                  </span>
                </div>
              )}
            </div>
            {isError && <Message variant="danger">{error.message}</Message>}
            {cartItemsLoading ? (
              <Loader />
            ) : (
              <div className="px-2 py-1">
                {cartItems && cartItems.length === 0 ? (
                  <div className={CartPageCss.emptyCart}>
                    <MdOutlineRemoveShoppingCart size={50}/>
                    <p>Your Cart Is Empty</p>
                  </div>
                ) : (
                  <ListGroup className="my-2">
                    {cartItems &&
                      cartItems.map((item) => (
                        <ListGroup.Item
                          key={item._id}
                          className="my-2 rounded-3"
                        >
                          <Row className="my-2 rounded d-flex align-items-center">
                            <Col md={2}>
                              <Image
                                src={item.product.image}
                                alt={item.product.name}
                                fluid
                                rounded
                              />
                            </Col>
                            <Col md={4}>
                              <Link
                                to={`/product/GHS {item.product._id}`}
                                className="text-decoration-none fw-medium fs-6"
                              >
                                {item.product.name}
                              </Link>
                            </Col>
                            <Col md={2}>
                              <span className="text-black fw-medium fs-6">
                                GHS {item.product.price}
                              </span>
                            </Col>
                            <Col md={2}>
                              <div className="d-flex align-items-center">
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => {
                                    const newQty = item.quantity - 1;
                                    if (newQty >= 1) {
                                      updateCartItemQuantity(
                                        item.product._id,
                                        newQty
                                      );
                                    }
                                  }}
                                >
                                  <FaMinus />
                                </Button>

                                <p className="mx-3 my-0 fw-medium fs-6">
                                  {item.quantity}
                                </p>

                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => {
                                    const newQty = item.quantity + 1;
                                    if (newQty <= item.product.countInStock) {
                                      updateCartItemQuantity(
                                        item.product._id,
                                        newQty
                                      );
                                    }
                                  }}
                                >
                                  <FaPlus />
                                </Button>
                              </div>
                            </Col>

                            <Col md={2}>
                              <Button
                                type="button"
                                variant="danger"
                                onClick={() =>
                                  removeItemHandler(item.product._id)
                                }
                              >
                                <FaTrash />
                              </Button>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                  </ListGroup>
                )}
              </div>
            )}
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
                  <h3>Summary</h3>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="fs-6 text-black">Items</p>{" "}
                    <p className="text-mute fs-6">{totalItems} items</p>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="fs-6 text-black">Total Price: </p>
                    <p className="text-mute fs-6">GHS {subtotal.toFixed(2)}</p>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    type="button"
                    className={CartPageCss.button}
                    disabled={cartItems && cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Proceed To Checkout
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default CartPage;
