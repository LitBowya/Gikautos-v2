import { Container } from "react-bootstrap";
import TopProduct from "../components/Product/TopProduct";
import LatestProducts from "../components/Product/LatestProducts";
import MostPurchasedProducts from "../components/Product/MostPurchasedProducts";
import ProductByCategory from "../components/Product/ProductByCategory";
import HeroSection from "../components/HeroSection/HeroSection";
import Banner from "../components/Banner/Banner";
import Footer from "../components/Footer/Footer";
import CarBrands from "../components/CarBrands/CarBrands";

const HomePage = () => {
  return (
    <>
      <HeroSection />

      <Container fluid>
        <CarBrands />
        <TopProduct />
        <LatestProducts />
        <MostPurchasedProducts />
        <Banner />
        <ProductByCategory category="Lubricants" />
        <ProductByCategory category="Batteries" />
        <ProductByCategory category="Belts" />
        <ProductByCategory category="Filters" />
      </Container>
      <Footer />
    </>
  );
};

export default HomePage;
