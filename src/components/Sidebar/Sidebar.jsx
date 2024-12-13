import React, { useContext, useState } from "react";
import "./Sidebar.css";
import { Tooltip } from "@mui/material";
import { adminSideBarData, userSideBarData } from "../../LeftPaneldata";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { MyContext } from "../Layout/Layout";

const Sidebar = () => {

  const userIsAdmin = useLocation();
  const { isSidebarVisible, setIsSidebarVisible } = useContext(MyContext);
  const { user } = useSelector((state) => state.user);
  const { state } = userIsAdmin; // Access state data;
  const isAdmin = state?state:user?.isAdmin
  const menuToBeRendered = isAdmin ? adminSideBarData : userSideBarData;

  return (
    <div className={`sidebar ${isSidebarVisible ? "close" : ""}`}>
      <ul className="menu-item">
        {menuToBeRendered.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.id} className={isActive ? "active" : ""}>
              <NavLink to={item.path}>
                <Tooltip title={item.name} placement="right">
                  <span className="icon">{React.createElement(item.icon)}</span>
                </Tooltip>
                <span className="text">{item.name}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
