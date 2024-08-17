import React from "react";
import BannerCss from "./Banner.module.css";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className={BannerCss.banner}>
      <div className={BannerCss.bannerLeft}>
        <div className={BannerCss.left}>
          <span>BIG SALE COUNTDOWN</span>
          <span>HURRY UP !</span>
        </div>
        <div className={BannerCss.right}>
          <span>
            75% <small>OFF</small>
          </span>
          <span>
            <Link to="/shop" className={BannerCss.link}>View Details</Link>
          </span>
        </div>
      </div>
      <div className={BannerCss.bannerRight}>
        <div>
          <span>
            ORIGINAL CAR PARTS <span>2024</span>
          </span>
          <span>discover new arrivals</span>
          <span>200 + spare parts</span>
        </div>
      </div>
    </div>
  );
};

export default Banner;
