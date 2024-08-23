import React from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import UserInfo from "./UserInfo/UserInfo";
import Channels from "./Channels/Channels";
import PrivateChat from "./PrivateChat/PrivateChat";
import "./SidebarMenu.css";

const SidebarMenu = () => {
  return (
    <Menu
      className="custom-sidebar"
      borderless
      vertical
      visible
      size="large"
      fixed="left"
    >
      <div>
        <UserInfo />
        <Channels />
        <PrivateChat />
      </div>
      <div>
        <Link to="/" className="home-button">
          Go Home
        </Link>
      </div>
    </Menu>
  );
};

export default SidebarMenu;
