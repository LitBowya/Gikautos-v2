import { Outlet } from "react-router-dom";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Image } from "react-bootstrap";
import {
  FaSignOutAlt,
  FaHome,
  FaUsers,
  FaBox,
  FaShoppingCart,
} from "react-icons/fa";
import { useLogoutMutation } from "../../slices/usersApiSlice";
import { setCredentials } from "../../slices/authSlice";
import { useDispatch } from "react-redux";
import AdminLayoutCss from "./AdminLayout.module.css";

const { Header, Content, Sider } = Layout;

const AdminLayout = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(setCredentials(null)); // Clear user info from the state
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={250}
        collapsible
        collapsedWidth={80}
        theme="dark"
        breakpoint="lg"
      >
        <Menu mode="inline" className={AdminLayoutCss.menu}>
          <div className={AdminLayoutCss.userInfo}>
            <Image
              src={userInfo.profilePicture}
              roundedCircle
              className={AdminLayoutCss.image}
            />
          </div>
          <Menu.Item
            key="1"
            icon={<FaHome />}
            className={AdminLayoutCss.menuItem}
          >
            <Link to="/admin/dashboard" className={AdminLayoutCss.navLink}>
              Overview
            </Link>
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<FaUsers />}
            className={AdminLayoutCss.menuItem}
          >
            <Link className={AdminLayoutCss.navLink} to="/admin/userlist">
              Manage Users
            </Link>
          </Menu.Item>
          <Menu.Item
            key="3"
            icon={<FaBox />}
            className={AdminLayoutCss.menuItem}
          >
            <Link className={AdminLayoutCss.navLink} to="/admin/productlist">
              Manage Product
            </Link>
          </Menu.Item>
          <Menu.Item
            key="4"
            icon={<FaShoppingCart />}
            className={AdminLayoutCss.menuItem}
          >
            <Link className={AdminLayoutCss.navLink} to="/admin/orderlist">
              Manage Orders
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className={AdminLayoutCss.navbar}>
          <div>
            <p className={AdminLayoutCss.username}>Welcome {userInfo.name}</p>
          </div>
          <div onClick={handleLogout}>
            <FaSignOutAlt size={30} />
          </div>
        </Header>
        <Content style={{ margin: "16px" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
