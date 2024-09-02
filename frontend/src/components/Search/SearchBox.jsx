import React, { useState } from "react";
import { Form, Row, Col, Container } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "../../slices/productsApiSlice";
import Loader from "../Loader/Loader";
import Product from "../Product/Product";
import Message from "../Message/Message";

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({
    keyword: urlKeyword,
  });

  const [searchKeyword, setSearchKeyword] = useState(urlKeyword || "");

  const filteredProducts = searchKeyword
      ? data?.products?.filter((product) =>
          product.name.toLowerCase().includes(searchKeyword.toLowerCase())
      )
      : null;


  const submitHandler = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/search/${searchKeyword.trim()}`);
      setSearchKeyword("");
    } else {
      navigate("/");
    }
  };

  return (
      <Container className="my-2">
        <Form onSubmit={submitHandler} className="d-flex">
          <Form.Control
              type="text"
              name="q"
              onChange={(e) => setSearchKeyword(e.target.value)}
              value={searchKeyword}
              placeholder="Search Products..."
              className="pl-3 py-2"
          ></Form.Control>
        </Form>

        {isLoading ? (
            <Loader />
        ) : isError ? (
            <Message variant="danger">Failed to load products</Message>
        ) : (
            <>
              {filteredProducts && (
                  <Row>
                    {filteredProducts.map((product) => (
                        <Col key={product._id} xs={6} lg={4} xl={2} className="mb-3">
                          <Product product={product} />
                        </Col>
                    ))}
                  </Row>
              )}
            </>
        )}
      </Container>
  );
};

export default SearchBox;
