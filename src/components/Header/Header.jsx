import React, { useContext, useEffect, useState } from "react";
import "./Header.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/Images/logo.jpg";
import {
  Badge,
  Button,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Popover,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import TextFieldsOutlinedIcon from "@mui/icons-material/TextFieldsOutlined";
// Context and State Management
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import dayjs from "dayjs";
import { MyContext } from "../Layout/Layout";
// Notifications Menu Component
import NotificationsMenu from "../Notifications/NotificationsMenu";
import PopupModals from "../Common/Modals/Popup/PopupModals";
import ProfilePage from "../../pages/ProfilePage/ProfilePage";
import ResetPasswordFromProfile from "../../pages/ProfilePage/ResetPasswordFromProfile";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import CheckAndShowImage from "../Common/CustomImage/showImage";
import {
  FullscreenExitOutlinedIcon,
  MenuOpenIcon,
  MenuOutlined,
  FullscreenOutlinedIcon,
  PersonOutlineOutlinedIcon,
  NotificationsOutlinedIcon,
  Logout,
  KeyOutlinedIcon,
  InfoOutlinedIcon,
  SyncOutlinedIcon,
} from "../Common/Buttons/CustomIcon";

// Driver.js
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import guideSteps from "../Driver/guideSteps";
import "../Driver/DriverTour.css";
import { defaultTheme, ThemeContext } from "../../Theme/Themeprovider";
import { Palette } from "@mui/icons-material";
import { themeColors } from "../../Theme/ColorFile";
import NewPopUpModal from "../Common/Modals/Popup/NewPopUpModal";
import SyncZimbraCalendar from "../../pages/ProfilePage/SyncZimbraCalendar";

const presets = {
  small: {
    '--para-font-size': 'clamp(12px, 1vw, 16px)',
    '--button-font-size': 'clamp(12px, 1vw, 16px)',
    '--heading-font-size': 'clamp(20px, 2.5vw, 28px)',
    '--subheading-font-size': 'clamp(18px, 2vw, 24px)',
    '--subsubheading-font-size': 'clamp(16px, 1.8vw, 22px)',
    '--datagrid-header-font-size': 'clamp(12px, 1.3vw, 18px)',
    '--datagrid-row-font-size': 'clamp(10px, 0.9vw, 14px)',
  },
  normal: {
    '--para-font-size': 'clamp(14px, 1.2vw, 18px)',
    '--button-font-size': 'clamp(14px, 1.3vw, 18px)',
    '--heading-font-size': 'clamp(24px, 3vw, 32px)',
    '--subheading-font-size': 'clamp(20px, 2.5vw, 28px)',
    '--subsubheading-font-size': 'clamp(16px, 2vw, 24px)',
    '--datagrid-header-font-size': 'clamp(14px, 1.5vw, 20px)',
    '--datagrid-row-font-size': 'clamp(12px, 1vw, 16px)',
  },
  large: {
    '--para-font-size': 'clamp(16px, 1.5vw, 20px)',
    '--button-font-size': 'clamp(16px, 1.6vw, 20px)',
    '--heading-font-size': 'clamp(28px, 3.5vw, 36px)',
    '--subheading-font-size': 'clamp(24px, 3vw, 32px)',
    '--subsubheading-font-size': 'clamp(20px, 2.5vw, 28px)',
    '--datagrid-header-font-size': 'clamp(16px, 1.8vw, 24px)',
    '--datagrid-row-font-size': 'clamp(14px, 1.2vw, 18px)',
  }
};

const Header = () => {
  const context = useContext(MyContext);
  const { user } = useSelector((state) => state.user);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [fontSizeAnchorEl, setFontSizeAnchorEl] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [unReadCount, setUnReadCount] = useState(0);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isZimbraSync, setIsZimbraSync] = useState(false);
  const navigate = useNavigate();
  const [isHelpPopupOpen, setIsHelpPopupOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const location = useLocation();
  const isAdmin = user?.UserType?.isAdmin === 'admin';

  const dispatch = useDispatch();
  const { changeTheme, selectedThemeIndex, themeColors } = useContext(ThemeContext);
  const [themeMenuAnchor, setThemeMenuAnchor] = useState(null);

  const handleThemeMenuToggle = (event) => {
    setThemeMenuAnchor(themeMenuAnchor ? null : event.currentTarget);
  };

  const handleFontSizeButtonClick = (event) => {
    setFontSizeAnchorEl(event.currentTarget);
  };

  const handleFontSizeButtonClose = () => {
    setFontSizeAnchorEl(null);
  };

  const handlePresetChange = (presetKey) => {
    const preset = presets[presetKey];
    Object.keys(preset).forEach((key) => {
      document.documentElement.style.setProperty(key, preset[key]);
    });
    handleFontSizeButtonClose();
  };

  const handleThemeChange = (index) => {
    changeTheme(index);
    setThemeMenuAnchor(null);
  };

  const handleStartGuide = () => {
    const driverObj = driver({
      overlayColor: "black",
      overlayOpacity: "0.8",
      prevBtnText: "← Previous",
      popoverClass: "driverjs-theme",
      steps: guideSteps[location.pathname]?.(isSmallScreen, isAdmin),
      animate: true,
    });
    driverObj.drive(); // Start the tour
  };

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

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const endpoint = `/api/v1/notification/limited-notification`;
        const response = await axios.get(endpoint, { withCredentials: true });
        setUnReadCount(
          response.data.notification?.filter((data) => data.isRead === false)
            ?.length
        );
        setNotificationList(
          response.data.notification?.map((data) => {
            const timeDifference = dayjs().diff(dayjs(data?.createdAt), "hour");

            return {
              avatar: `${import.meta.env.VITE_API_URL}/${data?.User?.avatarPath}`,
              name: data?.User?.fullname,
              action: data?.type,
              item: data?.message,
              time: `${timeDifference} hours ago`,
            };
          })
        );
      } catch (error) {
        // toast.error("Failed to fetch Notification");
        console.error("Error fetching Notification:", error);
      }
    };

    fetchNotification();
  }, []);

  // Logout Handler
  const handleLogout = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `/api/v1/user/logout`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success("User Logged Out");
        navigate("/login");
      } else {
        // toast.error("Logout Failed");
      }
      dispatch(hideLoading());
    } catch (error) {
      // toast.error(error.response?.data?.message || "An error occurred");
      console.error(error);
      dispatch(hideLoading());
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

  // Sync Zimbra Calendar Hook
  const handleZimbraSync = () => {
    setIsZimbraSync(true);
  };

  return (
    <header>
      <div className="container-fluid w-100">
        <div className="headerWrapper">
          <div className="part2 col-lg-1 col-md-1 col-sm-3 col-xs-3">
            <Tooltip title="Menu Bar">
              <Button
                id="sidebar-icon"
                className="rounded-circle"
                onClick={() =>
                  context.setIsSidebarVisible(!context.isSidebarVisible)
                }
              >
                {context.isSidebarVisible ? <MenuOutlined /> : <MenuOpenIcon />}
              </Button>
            </Tooltip>
          </div>
          <div className="col-lg-4 col-md-4 col-sm-4 col-xs-3 part1">
            <Link
              to={"/dashboard"}
              className="d-flex align-items-center logo gap-2"
            >
              <img src={logo} alt="logo" />
              <span>Harambee</span>
            </Link>
          </div>
          <div className="col-lg-1 col-md-4 col-sm-4 col-xs-3">
            <Typography className="heading" sx={{ display: "none" }}>
              Harambee
            </Typography>
          </div>
          {/* Action Buttons */}
          <div className="col-lg-6 col-md-4 col-sm-4 col-xs-3 d-flex align-items-center justify-content-end gap-2">
            {isSmallScreen ? (
              ""
            ) : (
              <Button className="rounded-circle" onClick={handleStartGuide}>
                <Tooltip title="Help">
                  <InfoOutlinedIcon />
                </Tooltip>
              </Button>
            )}
            {!isSmallScreen && (
              <Button
                className="rounded-circle"
                onClick={handleMenuToggle(setThemeMenuAnchor)}
                style={{
                  color: "white",
                  backgroundColor: "#0462ffd1",
                }}
              >
                <Tooltip title="Change Theme">
                  <Palette />
                </Tooltip>
              </Button>
            )}
            {/* {!isSmallScreen && (
              <Button
                className="rounded-circle"
                onClick={handleFontSizeButtonClick}
                style={{
                  color: "white",
                  backgroundColor: "#0462ffd1",
                }}
              >
                <Tooltip title="Change Theme">
                  <TextFieldsOutlinedIcon />
                </Tooltip>
              </Button>
            )} */}
            {user.UserType.notificationModule &&
              user.UserType.notificationModule.split(",").includes("view") && (
                <Button
                  id="notification-icon"
                  className="rounded-circle"
                  onClick={handleMenuToggle(setNotificationsAnchor)}
                >
                  <Tooltip title="Notification">
                    <Badge badgeContent={unReadCount} color="error">
                      <NotificationsOutlinedIcon />
                    </Badge>
                  </Tooltip>
                </Button>
              )}
            <Button
              id="fullscreen-icon"
              className="rounded-circle"
              onClick={handleFullScreen}
            >
              <Tooltip title="Full Screen">
                {isFullScreen ? (
                  <FullscreenExitOutlinedIcon />
                ) : (
                  <FullscreenOutlinedIcon />
                )}
              </Tooltip>
            </Button>
            <Button
              id="my-account"
              className="myAccWrapper"
              onClick={handleMenuToggle(setMenuAnchor)}
            >
              <Tooltip title="My Account">
                <div className="profileImage">
                  <span className="profilePhoto">
                    <CheckAndShowImage
                      placement={"left"}
                      imageUrl={`${import.meta.env.VITE_API_URL}/${user?.avatarPath}`}
                    />
                  </span>
                </div>
              </Tooltip>
            </Button>
          </div>
        </div>
      </div>
      {/* Font Size Menu */}
      <Menu
        anchorEl={fontSizeAnchorEl}
        open={Boolean(fontSizeAnchorEl)}
        onClose={handleFontSizeButtonClose}
      >
        <MenuItem onClick={() => handlePresetChange("small")}>Small</MenuItem>
        <MenuItem onClick={() => handlePresetChange("normal")}>
          Normal
        </MenuItem>
        <MenuItem onClick={() => handlePresetChange("large")}>Large</MenuItem>
      </Menu>
      {/* Profile Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
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
        {isSmallScreen && (
          <MenuItem
            onClick={() => {
              setThemeMenuAnchor(menuAnchor);
              setMenuAnchor(null);
            }}
            sx={{ color: "black" }}
          >
            <ListItemIcon>
              <Palette fontSize="small" sx={{ color: "black" }} />
            </ListItemIcon>
            Change Theme
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            handleStartGuide();
            setMenuAnchor(null);
          }}
          sx={{ color: "black" }}
        >
          <ListItemIcon>
            <InfoOutlinedIcon fontSize="small" sx={{ color: "black" }} />
          </ListItemIcon>
          Take A Tour
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleEdit();
            setMenuAnchor(null);
          }}
          sx={{ color: "black" }}
        >
          <ListItemIcon>
            <PersonOutlineOutlinedIcon fontSize="small" sx={{ color: "black" }} />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleResetPassword();
            setMenuAnchor(null);
          }}
          sx={{ color: "black" }}
        >
          <ListItemIcon>
            <KeyOutlinedIcon fontSize="small" sx={{ color: "black" }} />
          </ListItemIcon>
          Reset Password
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleZimbraSync();
            setMenuAnchor(null);
          }}
          sx={{ color: "black" }}
        >
          <ListItemIcon>
            <SyncOutlinedIcon fontSize="small" sx={{ color: "black" }} />
          </ListItemIcon>
          Sync/Unsync Zimbra
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleLogout();
            setMenuAnchor(null);
          }}
          sx={{ color: "red" }}
        >
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: "red" }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Theme Menu */}
      <Menu
        anchorEl={themeMenuAnchor}
        open={Boolean(themeMenuAnchor)}
        onClose={() => setThemeMenuAnchor(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{ padding: "10px !important" }}
      >
        {themeColors.map((theme, index) => (
          <MenuItem
            key={index}
            onClick={() => handleThemeChange(index)}
            style={{
              backgroundColor: theme.linearGradientColorMain,
              color: theme.textColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            Theme {index + 1}
            <span
              style={{
                display: "inline-block",
                width: "20px",
                height: "20px",
                background: `linear-gradient(90deg, ${theme.linearGradientColorMain}, ${theme.linearGradientColorMain2})`,
                borderRadius: "50%",
                marginLeft: "10px",
              }}
            ></span>
            {selectedThemeIndex === index && (
              <CheckIcon style={{ marginLeft: "auto" }} />
            )}
          </MenuItem>
        ))}
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
          notifications={notificationList}
          unReadCount={unReadCount}
          onClose={() => setNotificationsAnchor(null)}
        />

      </Popover>

      <NewPopUpModal
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title={"My Profile"}
        modalBody={<ProfilePage user={user} />}
      />

      <NewPopUpModal
        isOpen={isResetPasswordOpen}
        setIsOpen={setIsResetPasswordOpen}
        title={"Reset Password"}
        modalBody={<ResetPasswordFromProfile user={user} />}
      />

      <NewPopUpModal
        isOpen={isZimbraSync}
        setIsOpen={setIsZimbraSync}
        title={"Sync/Unsync Zimbra Calendar"}
        modalBody={<SyncZimbraCalendar user={user} isOpen={isZimbraSync} />}
      />
    </header>
  );
};

export default Header;
