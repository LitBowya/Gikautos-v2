import { FaShoppingCart, FaUser, FaSearch, FaHeart } from "react-icons/fa";
import { FaRocketchat, FaGears } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { Container, Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { useGetCartItemsQuery } from "../../slices/cartApiSlice";
import { useGetWishlistQuery } from "../../slices/wishlistSlice";
import Logo from "../Logo/Logo";
import HeaderCss from "./Header.module.css";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);


  // Fetch cart and wishlist data
  const { data: cartItems } = useGetCartItemsQuery();
  const { data: wishlistItems } = useGetWishlistQuery();
  // Calculate total quantities
  const totalCartItems = cartItems
    ? cartItems.reduce((acc, item) => acc + item.quantity, 0)
    : 0;
  const totalWishlistItems = wishlistItems ? wishlistItems.length : 0;

  return (
    <header className={`${HeaderCss.navbarHeader}`}>
      <div className={HeaderCss.topNav}>
        <Container className={HeaderCss.topNavContainer}>
          <span>
            <IoIosMail />
            Our email
          </span>
          <span>
            <FaPhone />
            Our contact
          </span>
        </Container>
      </div>
      <Container>
        <nav className={HeaderCss.navbar}>
          <Link to="/" className={HeaderCss.logo}>
            <Logo />
          </Link>

          <ul className={HeaderCss.navbarList}>
            <li>
              <Link className={HeaderCss.navbarIcon} to="/search">
                <FaSearch />
              </Link>
            </li>

            {userInfo ? (
              <>
                <li className={HeaderCss.iconWithBadge}>
                  <Link className={HeaderCss.navbarIcon} to="/cart">
                    <FaShoppingCart />
                    {totalCartItems > 0 && (
                      <Badge className={HeaderCss.badge}>
                        {totalCartItems}
                      </Badge>
                    )}
                  </Link>
                </li>
                <li className={HeaderCss.iconWithBadge}>
                  <Link className={HeaderCss.navbarIcon} to="/wishlist">
                    <FaHeart />
                    {totalWishlistItems > 0 && (
                      <Badge className={HeaderCss.badge}>
                        {totalWishlistItems}
                      </Badge>
                    )}
                  </Link>
                </li>

                <li>
                  <Link to="/profile">
                    <img
                      src={userInfo.profilePicture}
                      alt="Profile"
                      style={{ width: "30px", height: "30px" }}
                      className="rounded-circle"
                    />
                  </Link>
                </li>

                <div className={HeaderCss.fixedIcons}>
                  <Link
                    to="/chatpage"
                    className={HeaderCss.icon1}
                    data-tooltip="Chat Page"
                  >
                    <FaRocketchat />
                  </Link>
                  <Link
                    to="/mechanic"
                    className={HeaderCss.icon2}
                    data-tooltip="Mechanic"
                  >
                    <FaGears />
                  </Link>
                </div>
              </>
            ) : (
              <li>
                <Link to="/login" className={HeaderCss.navbarIcon}>
                  <FaUser />
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </Container>
      <div className={HeaderCss.downNav}>
        <Container className={HeaderCss.downNavContainer}>
          <Link to="/shop" className={HeaderCss.navLink}>
            Shop
          </Link>
          <Link to="/category/Lubricants" className={HeaderCss.navLink}>
            Lubricants
          </Link>
          <Link to="/category/Filters" className={HeaderCss.navLink}>
            Filters
          </Link>
          <Link to="/category/Batteries" className={HeaderCss.navLink}>
            Battery
          </Link>
          <Link to="/category/Belts" className={HeaderCss.navLink}>
            Belts
          </Link>
        </Container>
      </div>
    </header>
  );
};

export default Header;
