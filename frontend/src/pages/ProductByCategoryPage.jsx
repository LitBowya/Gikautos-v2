import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Form, Container, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  useGetProductsByCategoryQuery,
  useGetBrandsQuery,
} from "../slices/productsApiSlice";
import Product from "../components/Product/Product";
import Loader from "../components/Loader/Loader";
import Message from "../components/Message/Message";
import ProductByCategoryCss from "./ProductByCategory.module.css"; // CSS Module for this page

const ProductByCategoryPage = () => {
  const { category } = useParams();
  const [filters, setFilters] = useState({
    brand: [],
    minPrice: "",
    maxPrice: "",
    sort: "",
  });

  const {
    data: fetchedProducts,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useGetProductsByCategoryQuery({ category, ...filters });

  const {
    data: brands,
    isLoading: isLoadingBrands,
    error: brandsError,
  } = useGetBrandsQuery(category);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === "brand") {
      const selectedBrands = filters.brand.includes(value)
        ? filters.brand.filter((brand) => brand !== value)
        : [...filters.brand, value];
      setFilters({ ...filters, brand: selectedBrands });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  // Carousel images for different categories
  const imagesByCategory = {
    Lubricants: [
      {
        src: "/images/ShopPage/oil.jpg",
        title: "Engine Care Solutions",
        subtitle: "Enhance Performance & Extend Life",
      },
    ],
    Belts: [
      {
        src: "/images/ShopPage/belts.jpg",
        title: "Drive System Components",
        subtitle: "Ensure Seamless Functionality & Durability",
      },
    ],
    Filters: [
      {
        src: "/images/ShopPage/filters.jpg",
        title: "Advanced Filtration Systems",
        subtitle: "Maintain Cleanliness & Efficiency",
      },
    ],
    Batteries: [
      {
        src: "/images/ShopPage/battery.jpg",
        title: "Reliable Power Sources",
        subtitle: "Dependable Starts & Sustained Energy",
      },
    ],
  };

  const images = imagesByCategory[category] || [];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const intervalTimes = [3000, 5000, 4000, 4000];
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, intervalTimes[currentSlide]);
    return () => clearInterval(interval);
  }, [currentSlide, images.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <Container className="my-4">
      <Row>
        <Col md={3}>
          {/* Filters */}
          <Form className={ProductByCategoryCss.filterSidebar}>
            {/* Brand filter */}
            <Form.Group controlId="brand">
              <Form.Label>Brands</Form.Label>
              <div>
                {brands &&
                  brands.map((brand) => (
                    <Form.Check
                      key={brand}
                      type="checkbox"
                      label={brand}
                      id={`brand-${brand}`}
                      name="brand"
                      value={brand}
                      checked={filters.brand.includes(brand)}
                      onChange={handleFilterChange}
                    />
                  ))}
              </div>
            </Form.Group>
            {/* Price range filters */}
            <Form.Group controlId="minPrice">
              <Form.Label>Min Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter min price"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
            </Form.Group>
            <Form.Group controlId="maxPrice">
              <Form.Label>Max Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter max price"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </Form.Group>
            {/* Sort by filter */}
            <Form.Group controlId="sort">
              <Form.Label>Sort By</Form.Label>
              <div>
                <Form.Check
                  type="radio"
                  label="Newest In"
                  id="sort-newestIn"
                  name="sort"
                  value="newestIn"
                  checked={filters.sort === "newestIn"}
                  onChange={handleFilterChange}
                />
                <Form.Check
                  type="radio"
                  label="Most Reviewed"
                  id="sort-mostReviewed"
                  name="sort"
                  value="mostReviewed"
                  checked={filters.sort === "mostReviewed"}
                  onChange={handleFilterChange}
                />
                <Form.Check
                  type="radio"
                  label="Rating"
                  id="sort-rating"
                  name="sort"
                  value="rating"
                  checked={filters.sort === "rating"}
                  onChange={handleFilterChange}
                />
                <Form.Check
                  type="radio"
                  label="Lowest Price"
                  id="sort-lowestPrice"
                  name="sort"
                  value="lowestPrice"
                  checked={filters.sort === "lowestPrice"}
                  onChange={handleFilterChange}
                />
                <Form.Check
                  type="radio"
                  label="Highest Price"
                  id="sort-highestPrice"
                  name="sort"
                  value="highestPrice"
                  checked={filters.sort === "highestPrice"}
                  onChange={handleFilterChange}
                />
              </div>
            </Form.Group>
          </Form>
        </Col>
        <Col md={9}>
          {/* Carousel Header */}
          <div className={ProductByCategoryCss.carousel}>
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: index === currentSlide ? 1 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={ProductByCategoryCss.carouselImage}
                style={{ backgroundImage: `url(${image.src})` }}
              >
                <div className={ProductByCategoryCss.carouselText}>
                  <h3>{image.title}</h3>
                  <p>{image.subtitle}</p>
                </div>
              </motion.div>
            ))}
            <Button
              className={`${ProductByCategoryCss.carouselButton} ${ProductByCategoryCss.prevButton}`}
              onClick={handlePrev}
            >
              &#9664;
            </Button>
            <Button
              className={`${ProductByCategoryCss.carouselButton} ${ProductByCategoryCss.nextButton}`}
              onClick={handleNext}
            >
              &#9654;
            </Button>
            <div className={ProductByCategoryCss.carouselDots}>
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`${ProductByCategoryCss.dot} ${
                    index === currentSlide ? "active" : ""
                  }`}
                  onClick={() => goToSlide(index)}
                ></span>
              ))}
            </div>
          </div>
          {/* Products */}
          {isLoadingProducts || isLoadingBrands ? (
            <Loader />
          ) : productsError || brandsError ? (
            <Message variant="danger">
              {productsError && productsError.message}
              {brandsError && brandsError.message}
            </Message>
          ) : (
            <Row className={ProductByCategoryCss.productsRow}>
              <div className={ProductByCategoryCss.productsHeader}>
                <h2>Products in {category}</h2>
              </div>
              {fetchedProducts.map((product) => (
                <Col key={product._id} xs={6} md={4} xl={3} className="mb-3">
                  <Product product={product} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductByCategoryPage;
