import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, ListGroup, Image, Button, Card } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
} from "../slices/wishlistSlice";
import Message from "../components/Message/Message";
import Loader from "../components/Loader/Loader";

const WishlistPage = () => {
  const { data: wishlist = [], isLoading, refetch } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [clearWishlist, { isLoading: clearWishlistLoading, isError, error }] =
    useClearWishlistMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);


  const removeItemHandler = async (productId) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      try {
        await removeFromWishlist(productId).unwrap();
        refetch();
        toast.success("Item removed from wishlist");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    }
  };

  const clearWishlistHandler = async () => {
    if (window.confirm("Are you sure you want to clear the wishlist?")) {
      try {
        await clearWishlist().unwrap();
        refetch();
        toast.success("Wishlist cleared");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    }
  };

  return (
    <div className="container">
      <Row>
        <Col sm={12}>
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="my-2">Wishlist</h1>
            {clearWishlistLoading ? (
              <Loader />
            ) : (
              <Button className="d-block" onClick={clearWishlistHandler}>
                Clear Wishlist
              </Button>
            )}
          </div>
          {isError && <Message variant="danger">{error.message}</Message>}
          {isLoading ? (
            <Loader />
          ) : (
            <Card className="px-2 py-1">
              {wishlist && wishlist.length === 0 ? (
                <Message>Your wishlist is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {wishlist.map((item) => (
                    <ListGroup.Item key={item._id} className="my-2 rounded-3">
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
                          <Link to={`/product/${item.product._id}`}>
                            {item.product.name}
                          </Link>
                        </Col>
                        <Col md={2}>${item.product.price}</Col>
                        <Col md={2}>
                          <Button
                            type="button"
                            variant="danger"
                            onClick={() => removeItemHandler(item.product._id)}
                          >
                            <FaTrash />
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default WishlistPage;
