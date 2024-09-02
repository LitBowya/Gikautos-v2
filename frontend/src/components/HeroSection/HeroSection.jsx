import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../Logo/Logo";
import HeroSectionCss from "../HeroSection/HeroSection.module.css";
import { LazyLoadImage } from "react-lazy-load-image-component";

const carouselVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

const HeroSection = () => {
  const slidesData = [
    ["/images/HeroSection/automotive-lubricants.jpg"],
    ["/images/HeroSection/bty-1.jpg"],
    ["/images/HeroSection/fil-1.jpg"],
    ["/images/HeroSection/belt-1.jpg"],
  ];

  const createCarouselState = (initialValue) =>
    slidesData.map(() => initialValue);

  const [currentSlides, setCurrentSlides] = useState(createCarouselState(0));
  const [directions, setDirections] = useState(createCarouselState(0));

  useEffect(() => {
    const timers = slidesData.map((_, index) =>
      setInterval(() => {
        changeSlide(index, 1);
      }, getCarouselTiming(index))
    );

    return () => {
      timers.forEach((timer) => clearInterval(timer));
    };
  }, [currentSlides]);

  const getCarouselTiming = (index) => {
    switch (index) {
      case 0:
        return 3000;
      case 1:
        return 5000;
      case 2:
        return 4000;
      case 3:
        return 6000;
      default:
        return 3000;
    }
  };

  const changeSlide = (carouselIndex, direction) => {
    const slides = slidesData[carouselIndex];
    setDirections((prev) =>
      prev.map((dir, idx) => (idx === carouselIndex ? direction : dir))
    );
    setCurrentSlides((prev) =>
      prev.map((slide, idx) =>
        idx === carouselIndex
          ? (slide + direction + slides.length) % slides.length
          : slide
      )
    );
  };

  return (
    <div className={HeroSectionCss.heroSection}>
      <Container className={HeroSectionCss.container}>
        <motion.div
          className={HeroSectionCss.welcomeMarquee}
          animate={{ x: ["100%", "-100%"] }}
          transition={{
            repeat: Infinity,
            duration: 70,
            ease: "linear",
          }}
        >
          Welcome To <Logo />
        </motion.div>

        <div className={HeroSectionCss.parent}>
          {slidesData.map((slides, index) => (
            <div key={index} className={HeroSectionCss[`div${index + 1}`]}>
              <AnimatePresence initial={false} custom={directions[index]}>
                <motion.div
                  key={currentSlides[index]}
                  variants={carouselVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  custom={directions[index]}
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.5 },
                  }}
                  className={HeroSectionCss.slide}
                >
                  <LazyLoadImage
                    src={slides[currentSlides[index]]}
                    alt={`Slide ${index + 1}`}
                    placeholderSrc="https://placehold.co/400x400"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default HeroSection;
