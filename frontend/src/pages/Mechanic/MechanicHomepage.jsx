import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Row, Col, Form, Container, Button } from "react-bootstrap";
import {
  useGetFilteredMechanicsQuery,
  useGetFilteredOptionsQuery,
} from "../../slices/mechanicApiSlice";
import MechanicCard from "../../components/Mechanic/MechanicCard";
import Loader from "../../components/Loader/Loader";
import Message from "../../components/Message/Message";
import ShopPageCss from "../ShopPage.module.css"; // Reuse or create a similar CSS module

const MechanicHomepage = () => {
  const [filters, setFilters] = useState({
    specialties: [],
    regions: [],
    cities: [],
    towns: [],
    workingHours: [],
    sortBy: "",
  });
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Fetch filtered mechanics
  const {
    data: mechanics,
    isLoading: isLoadingMechanics,
    isError: isErrorMechanics,
  } = useGetFilteredMechanicsQuery(
    Object.fromEntries(
      Object.entries(filters).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.join(",") : value,
      ])
    )
  );

  // Fetch filter options
  const {
    data: filterOptions,
    isLoading: isLoadingFilters,
    isError: isErrorFilters,
  } = useGetFilteredOptionsQuery();

  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;
    if (
      name === "specialties" ||
      name === "regions" ||
      name === "cities" ||
      name === "towns" ||
      name === "workingHours"
    ) {
      const updatedFilter = checked
        ? [...filters[name], value]
        : filters[name].filter((item) => item !== value);
      setFilters({ ...filters, [name]: updatedFilter });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  // Optional carousel images and state
  const images = [
    // Define your images for carousel here
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const intervalTimes = [3000, 5000, 4000, 4000]; // Example durations
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, intervalTimes[currentSlide]);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const handleNext = () =>
    setCurrentSlide((prev) => (prev + 1) % images.length);
  const handlePrev = () =>
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  const goToSlide = (index) => setCurrentSlide(index);

  return (
    <Container className="my-4">
      <Row>
        <Col md={3} className={`d-md-block ${isFilterVisible ? "" : "d-none"}`}>
          {/* Filter Sidebar */}
          <Form className={ShopPageCss.filterSidebar}>
            {/* Specialties filter */}
            <Form.Group controlId="specialties">
              <Form.Label>Specialties</Form.Label>
              {isLoadingFilters ? (
                <Loader />
              ) : isErrorFilters ? (
                <Message variant="danger">Error loading filter options</Message>
              ) : (
                filterOptions?.specialties?.map((specialty) => (
                  <Form.Check
                    key={specialty}
                    type="checkbox"
                    label={specialty}
                    id={`specialty-${specialty}`}
                    name="specialties"
                    value={specialty}
                    checked={filters.specialties.includes(specialty)}
                    onChange={handleFilterChange}
                  />
                ))
              )}
            </Form.Group>
            {/* Regions filter */}
            <Form.Group controlId="regions">
              <Form.Label>Regions</Form.Label>
              {isLoadingFilters ? (
                <Loader />
              ) : isErrorFilters ? (
                <Message variant="danger">Error loading filter options</Message>
              ) : (
                filterOptions?.regions?.map((region) => (
                  <Form.Check
                    key={region}
                    type="checkbox"
                    label={region}
                    id={`region-${region}`}
                    name="regions"
                    value={region}
                    checked={filters.regions.includes(region)}
                    onChange={handleFilterChange}
                  />
                ))
              )}
            </Form.Group>
            {/* Cities filter */}
            <Form.Group controlId="cities">
              <Form.Label>Cities</Form.Label>
              {isLoadingFilters ? (
                <Loader />
              ) : isErrorFilters ? (
                <Message variant="danger">Error loading filter options</Message>
              ) : (
                filterOptions?.cities?.map((city) => (
                  <Form.Check
                    key={city}
                    type="checkbox"
                    label={city}
                    id={`city-${city}`}
                    name="cities"
                    value={city}
                    checked={filters.cities.includes(city)}
                    onChange={handleFilterChange}
                  />
                ))
              )}
            </Form.Group>
            {/* Towns filter */}
            <Form.Group controlId="towns">
              <Form.Label>Towns</Form.Label>
              {isLoadingFilters ? (
                <Loader />
              ) : isErrorFilters ? (
                <Message variant="danger">Error loading filter options</Message>
              ) : (
                filterOptions?.towns?.map((town) => (
                  <Form.Check
                    key={town}
                    type="checkbox"
                    label={town}
                    id={`town-${town}`}
                    name="towns"
                    value={town}
                    checked={filters.towns.includes(town)}
                    onChange={handleFilterChange}
                  />
                ))
              )}
            </Form.Group>
            {/* Working Hours filter */}
            <Form.Group controlId="workingHours">
              <Form.Label>Working Hours</Form.Label>
              {isLoadingFilters ? (
                <Loader />
              ) : isErrorFilters ? (
                <Message variant="danger">Error loading filter options</Message>
              ) : (
                filterOptions?.workingHours?.map((workingHour) => (
                  <Form.Check
                    key={workingHour}
                    type="checkbox"
                    label={workingHour}
                    id={`workingHour-${workingHour}`}
                    name="workingHours"
                    value={workingHour}
                    checked={filters.workingHours.includes(workingHour)}
                    onChange={handleFilterChange}
                  />
                ))
              )}
            </Form.Group>
            <Form.Group controlId="sortBy">
              <Form.Label>Sort By</Form.Label>
              {/* Radio buttons for sorting */}
              <div>
                <Form.Check
                  type="radio"
                  label="Newest"
                  id="sort-newest"
                  name="sortBy"
                  value="createdAt"
                  checked={filters.sortBy === "createdAt"}
                  onChange={handleFilterChange}
                />
                <Form.Check
                  type="radio"
                  label="Highest Rating"
                  id="sort-highestRating"
                  name="sortBy"
                  value="rating"
                  checked={filters.sortBy === "rating"}
                  onChange={handleFilterChange}
                />
                <Form.Check
                  type="radio"
                  label="Most Experienced"
                  id="sort-mostExperienced"
                  name="sortBy"
                  value="experience"
                  checked={filters.sortBy === "experience"}
                  onChange={handleFilterChange}
                />
              </div>
            </Form.Group>
          </Form>
        </Col>

        <Col md={9}>
          {/* Carousel */}
          {images.length > 0 && (
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
          )}
          {/* Mechanics List */}
          {isLoadingMechanics ? (
            <Loader />
          ) : isErrorMechanics ? (
            <Message variant="danger">Error loading mechanics</Message>
          ) : (
            <Row className={ShopPageCss.productsRow}>
              <div className={ShopPageCss.productsHeader}>
                <Button
                  className={`d-md-none mb-3 ${ShopPageCss.toggleFiltersButton}`}
                  onClick={() => setIsFilterVisible(!isFilterVisible)}
                >
                  {isFilterVisible ? "Hide Filters" : "Show Filters"}
                </Button>
                <h2>Mechanics</h2>
              </div>
              {mechanics?.mechanics?.map((mechanic) => (
                <Col key={mechanic._id} xs={6} md={4} xl={3} className="mb-3">
                  <MechanicCard mechanic={mechanic} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MechanicHomepage;
