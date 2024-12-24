import React, { useContext, useState } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import unknownUser from "../../assets/Images/unknownUser.PNG";
// Images
import logo from "../../assets/Images/logo.webp";

// MUI
import {
  Badge,
  Button,
  Divider,
  FormControlLabel,
  ListItemIcon,
  Menu,
  MenuItem,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";

// ICONS
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuOutlined from "@mui/icons-material/MenuOutlined";
import SearchBox from "../SearchBox/SearchBox";
import FullscreenOutlinedIcon from "@mui/icons-material/FullscreenOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import Logout from "@mui/icons-material/Logout";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";

// Context and State Management
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { MyContext } from "../Layout/Layout";

// Notifications Menu Component
import NotificationsMenu from "../Notifications/NotificationsMenu";
import { notifications } from "../../LeftPaneldata";
import PopupModals from "../Common Components/Modals/Popup/PopupModals";
import ProfilePage from "../../pages/ProfilePage/ProfilePage";
import ResetPassword from "../../pages/ProfilePage/ResetPassword";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";

const Header = () => {
  const context = useContext(MyContext);
  const { user } = useSelector((state) => state.user);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const navigate = useNavigate();

  // Common Function to Toggle Menus
  const handleMenuToggle = (anchorSetter) => (event) => {
    anchorSetter((prevAnchor) => (prevAnchor ? null : event.currentTarget));
  };

  // Handle Fullscreen Toggle
  const handleFullScreen = () => {
    const elem = document.documentElement;

    if (!isFullScreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      }
    }
    setIsFullScreen(!isFullScreen); // Toggle State
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      showLoading();
      const response = await axios.post(
        `/api/v1/user/logout`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success("User Logged Out");
        navigate("/login");
      } else {
        toast.error("Logout Failed");
      }
      hideLoading();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      console.error(error);
      hideLoading();
    }
  };

  // Edit Profile Handler
  const handleEdit = () => {
    setIsEditOpen(true);
  };

  // Reset Password Handler
  const handleResetPassword = () => {
    setIsResetPasswordOpen(true);
  };

  return (
    <header>
      <div className="container-fluid w-100">
        <div className="headerWrapper">
          <div className="col-lg-3 col-md-4 col-sm-4 col-xs-3 part1">
            <Link
              to={"/meeting-calendar"}
              className="d-flex align-items-center logo gap-2"
            >
              <img src={logo} alt="logo" />
              <span>Harambee</span>
            </Link>
          </div>
          <div className="part2 col-lg-2 col-md-2 col-sm-3 col-xs-3">
            <Tooltip title="Menu Bar">
              <Button
                className="rounded-circle"
                onClick={() =>
                  context.setIsSidebarVisible(!context.isSidebarVisible)
                }
              >
                {context.isSidebarVisible ? <MenuOpenIcon /> : <MenuOutlined />}
              </Button>
            </Tooltip>
          </div>
          <div className="col-lg-1 col-md-4 col-sm-4 col-xs-3">
            <Typography className="heading" sx={{ display: "none" }}>
              Harambee
            </Typography>
          </div>
          {/* Action Buttons */}
          <div className="col-lg-6 col-md-4 col-sm-4 col-xs-3 d-flex align-items-center justify-content-end gap-2">
            <Button
              className="rounded-circle"
              onClick={handleMenuToggle(setNotificationsAnchor)}
            >
              <Tooltip title="Notification">
                <Badge badgeContent={4} color="error">
                  <NotificationsOutlinedIcon />
                </Badge>
              </Tooltip>
            </Button>
            <Button className="rounded-circle" onClick={handleFullScreen}>
              <Tooltip title="Full Screen">
                {isFullScreen ? (
                  <FullscreenExitOutlinedIcon />
                ) : (
                  <FullscreenOutlinedIcon />
                )}
              </Tooltip>
            </Button>
            <Button
              className="myAccWrapper"
              onClick={handleMenuToggle(setMenuAnchor)}
            >
              <Tooltip title="My Account">
                <div className="profileImage">
                  <span className="profilePhoto">
                    <img
                      src={
                        user?.avatarPath
                          ? `${import.meta.env.VITE_API_URL}/${user?.avatarPath}`
                          : unknownUser
                      }
                      alt="My Pic"
                    />
                  </span>
                </div>
              </Tooltip>
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuToggle(setMenuAnchor)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div className="userInfo">
          <h4>Welcome,</h4>
          <p className="mb-0">{user?.fullname}</p>
        </div>
        <Divider
          variant="middle"
          component="li"
          sx={{ marginTop: "15px", marginBottom: "15px" }}
        />
        {/* <MenuItem onClick={handleEdit} sx={{ color: "black" }}>
          <ListItemIcon>
            <PersonOutlineOutlinedIcon
              fontSize="small"
              sx={{ color: "black" }}
            />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleResetPassword} sx={{ color: "black" }}>
          <ListItemIcon>
            <KeyOutlinedIcon fontSize="small" sx={{ color: "black" }} />
          </ListItemIcon>
          Reset Password
        </MenuItem> */}
        <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: "red" }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Popover
        open={Boolean(notificationsAnchor)}
        anchorEl={notificationsAnchor}
        onClose={handleMenuToggle(setNotificationsAnchor)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <NotificationsMenu
          notifications={notifications}
          onViewAll={() => alert("View All Notifications clicked!")}
        />
      </Popover>

      <PopupModals
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title={"Update My Profile"}
        modalBody={<ProfilePage user={user} />}
      />

      <PopupModals
        isOpen={isResetPasswordOpen}
        setIsOpen={setIsResetPasswordOpen}
        title={"Reset Password"}
        modalBody={<ResetPassword user={user} />}
      />
    </header>
  );
};

export default Header;
