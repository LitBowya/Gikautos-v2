import React from "react";
import { Menu } from "semantic-ui-react";
import UserInfo from "./UserInfo/UserInfo";
import Channels from "./Channels/Channels";
import PrivateChat from "./PrivateChat/PrivateChat";
import "./SidebarMenu.css";

const SidebarMenu = () => {
  return (
    <Menu className="custom-sidebar" borderless vertical visible size="large">
      <UserInfo />
      <Channels />
      <PrivateChat />
    </Menu>
  );
};

export default SidebarMenu;
