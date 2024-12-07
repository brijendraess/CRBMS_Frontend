import React, { useContext, useState } from "react";
import "./Sidebar.css";
import { Button, styled, Tooltip } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import { adminSideBarData, userSideBarData } from "../../data";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import { MyContext } from "../Layout/Layout";

// Styled components for the logout button
const LogoutButton = styled(Button)(({ theme }) => ({
  color: "red",
  textAlign: "left",
  justifyContent: "start",
  borderRadius: "0px",
  padding: "15px 15px",
  textTransform: "capitalize",
  fontFamily: "Poppins",
  fontSize: "large",
  "&:hover": {
    backgroundColor: theme.palette.error.light,
    color: "black",
  },
}));

const LogoutIcon = styled("span")(({ theme }) => ({
  width: "25px",
  height: "25px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginRight: "20px",
}));

const Sidebar = () => {
  const { isSidebarVisible, setIsSidebarVisible } = useContext(MyContext);
  const navigate = useNavigate();
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const { user } = useSelector((state) => state.user);
  const isAdmin = user?.isAdmin;

  const menuToBeRendered = isAdmin ? adminSideBarData : userSideBarData;

  const handleSubMenuToggle = (id) => {
    setOpenSubMenu((prevOpenId) => (prevOpenId === id ? null : id)); // Toggle submenu visibility
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `/api/v1/user/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        toast.success("User Logged Out");
        navigate("/login");
      } else {
        toast.error("Logout Failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      console.log(error);
    }
  };
  const location = useLocation();
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
