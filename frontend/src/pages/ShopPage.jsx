import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Row, Col, Form, Container, Button } from "react-bootstrap";
import {
  useGetAllProductsQuery,
  useGetBrandsQuery,
  useGetCategoriesQuery,
} from "../slices/productsApiSlice";
import Product from "../components/Product/Product";
import Loader from "../components/Loader/Loader";
import Message from "../components/Message/Message";
import ShopPageCss from "./ShopPage.module.css";

const ShopPage = () => {
  const [filters, setFilters] = useState({
    category: "",
    brand: [],
    minPrice: "",
    maxPrice: "",
    sort: "",
  });
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useGetAllProductsQuery(filters);
  const {
    data: brandsData,
    isLoading: brandsLoading,
    error: brandsError,
  } = useGetBrandsQuery(filters.category);
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesQuery();

  const brands = brandsData || [];
  const categories = categoriesData || [];

  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "category") {
      const updatedCategory = checked ? value : ""; // Toggle the category selection
      setFilters({ ...filters, category: updatedCategory, brand: [] }); // Reset brand filter when category changes
    } else if (name === "brand") {
      const updatedBrands = checked
        ? [...filters.brand, value]
        : filters.brand.filter((brand) => brand !== value);
      setFilters({ ...filters, brand: updatedBrands });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  const images = [
    {
      src: "/images/ShopPage/oil.jpg",
      title: "Engine Care Solutions",
      subtitle: "Enhance Performance & Extend Life",
    },
    {
      src: "/images/ShopPage/belts.jpg",
      title: "Drive System Components",
      subtitle: "Ensure Seamless Functionality & Durability",
    },
    {
      src: "/images/ShopPage/filters.jpg",
      title: "Advanced Filtration Systems",
      subtitle: "Maintain Cleanliness & Efficiency",
    },
    {
      src: "/images/ShopPage/battery.jpg",
      title: "Reliable Power Sources",
      subtitle: "Dependable Starts & Sustained Energy",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const intervalTimes = [3000, 5000, 4000, 4000]; // Durations for each slide
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, intervalTimes[currentSlide]);
    return () => clearInterval(interval);
  }, [currentSlide]);

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
      <div>
        <Row>
          <Col
            md={3}
            className={`d-md-block ${isFilterVisible ? "" : "d-none"}`}
          >
            {/* Filters */}
            <Form className={ShopPageCss.filterSidebar}>
              {/* Category filter */}
              <Form.Group controlId="category">
                <Form.Label className={ShopPageCss.label}>Category</Form.Label>
                {categoriesLoading ? (
                  <Loader />
                ) : categoriesError ? (
                  <p>Brands</p>
                ) : (
                  <div>
                    {categories.map((category) => (
                      <Form.Check
                        key={category}
                        type="checkbox"
                        label={category}
                        id={`category-${category}`}
                        name="category"
                        value={category}
                        checked={filters.category === category}
                        onChange={handleFilterChange}
                      />
                    ))}
                  </div>
                )}
              </Form.Group>
              {/* Brand filter */}
              <Form.Group controlId="brand">
                <Form.Label className={ShopPageCss.label}>Brand</Form.Label>
                {brandsLoading ? (
                  <Loader />
                ) : brandsError ? (
                  <Message>{brandsError.message}</Message>
                ) : (
                  <div>
                    {brands.map((brand) => (
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
                )}
              </Form.Group>
              {/* Price range filter */}
              <Form.Group controlId="minPrice">
                <Form.Label className={ShopPageCss.label}>Min Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter min price"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
              </Form.Group>
              <Form.Group controlId="maxPrice">
                <Form.Label className={ShopPageCss.label}>Max Price</Form.Label>
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
                <Form.Label className={ShopPageCss.label}>Sort By</Form.Label>
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
            {/* Carousel */}
            <div className={ShopPageCss.carousel}>
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: index === currentSlide ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className={ShopPageCss.carouselImage}
                  style={{ backgroundImage: `url(${image.src})` }}
                >
                  <div className={ShopPageCss.carouselText}>
                    <h3>{image.title}</h3>
                    <p>{image.subtitle}</p>
                  </div>
                </motion.div>
              ))}
              <Button
                className={`${ShopPageCss.carouselButton} ${ShopPageCss.prevButton}`}
                onClick={handlePrev}
              >
                &#9664;
              </Button>
              <Button
                className={`${ShopPageCss.carouselButton} ${ShopPageCss.nextButton}`}
                onClick={handleNext}
              >
                &#9654;
              </Button>
              <div className={ShopPageCss.carouselDots}>
                {images.map((_, index) => (
                  <span
                    key={index}
                    className={`${ShopPageCss.dot} ${
                      index === currentSlide ? "active" : ""
                    }`}
                    onClick={() => goToSlide(index)}
                  ></span>
                ))}
              </div>
            </div>
            {/* Products */}
            {productsLoading ? (
              <Loader />
            ) : productsError ? (
              <Message variant="danger">{productsError.message}</Message>
            ) : products && products.length > 0 ? (
              <Row className={ShopPageCss.productsRow}>
                <div className={ShopPageCss.productsHeader}>
                  <div className={ShopPageCss.headerButton}>
                    <Button
                      className={`d-md-none mb-3 ${ShopPageCss.toggleFiltersButton}`}
                      onClick={() => setIsFilterVisible(!isFilterVisible)}
                    >
                      {isFilterVisible ? "Hide Filters" : "Show Filters"}
                    </Button>
                  </div>
                  <h2>Shop</h2>
                </div>
                {products.map((product) => (
                  <Col key={product._id} xs={6} md={4} xl={3} className="mb-3">
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
            ) : (
              <Message variant="info">No products available</Message>
            )}
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default ShopPage;
