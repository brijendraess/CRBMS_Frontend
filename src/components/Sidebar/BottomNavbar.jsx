import React, { useEffect, useState } from "react";
import {
  Tooltip,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import {  getSideBarMenuContent } from "../../LeftPaneldata";
import { useSelector } from "react-redux";
import "./BottomNavbar.css";

const BottomNavBar = () => {
  const userIsAdmin = useLocation();
  const { user } = useSelector((state) => state.user);
    const [menuToBeRendered,setMenuToBeRendered]=useState([])

  useEffect(async()=>{
    const sidebar = await getSideBarMenuContent(user);
    setMenuToBeRendered({...menuToBeRendered,sidebar})
  },[user])

  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <BottomNavigation
      sx={{
        width: "100%",
        position: "fixed",
        bottom: 0,
        backgroundColor: "#fff",
        zIndex: 1000,
        boxShadow: "0px -2px 10px rgba(0,0,0,0.1)",
        display: "flex",
        justifyContent: "space-evenly",
      }}
    >
      {menuToBeRendered?.sidebar?.length&& menuToBeRendered?.sidebar?.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          style={{
            width: "35px",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "56px",
          }}
        >
          <Tooltip title={item.name} placement="top">
            <BottomNavigationAction
              icon={React.createElement(item.icon)}
              sx={{
                color: currentPath === item.path ? "#1976d2" : "gray",
                "&.Mui-selected": {
                  color: "#1976d2",
                },

                "&.MuiButtonBase-root": {
                  minWidth: "40px",
                },
              }}
            />
          </Tooltip>
        </NavLink>
      ))}
    </BottomNavigation>
  );
};

export default BottomNavBar;
