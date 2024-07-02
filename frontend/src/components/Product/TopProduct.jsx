import { Row, Col } from "react-bootstrap";
import Product from "./Product";
import Loader from "../Loader/Loader";
import Message from "../Message/Message";
import { useGetTopProductsQuery } from "../../slices/productsApiSlice";

const TopProduct = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : products ? (
        <div>
          <h1>Top Products</h1>

          <Row>
            {products.map((product) => (
              <Col key={product._id} xs={6} md={4} xl={2} className="mb-3">
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <Message variant="info">No products available</Message>
      )}
    </div>
  );
};

export default TopProduct;
