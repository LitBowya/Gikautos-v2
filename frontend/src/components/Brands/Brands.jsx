import BrandCss from "./Brands.module.css";
import {
  SiNissan,
  SiToyota,
  SiBmw,
  SiHyundai,
  SiOpel,
  SiKia,
  SiHonda,
} from "react-icons/si";
import { motion } from "framer-motion";

const Brands = () => {
  const icons = [
    <SiNissan className={BrandCss.icon} />,
    <SiToyota className={BrandCss.icon} />,
    <SiBmw className={BrandCss.icon} />,
    <SiHyundai className={BrandCss.icon} />,
    <SiOpel className={BrandCss.icon} />,
    <SiKia className={BrandCss.icon} />,
    <SiHonda className={BrandCss.icon} />,
  ];
  return (
    <div className={BrandCss.brands}>
      <motion.div
        className={BrandCss.container}
        animate={{ x: ["100%", "-100%"] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "easeInOut",
        }}
      >
        {icons.map((icon, index) => (
          <span key={index}>{icon}</span>
        ))}
      </motion.div>
    </div>
  );
};

export default Brands;
