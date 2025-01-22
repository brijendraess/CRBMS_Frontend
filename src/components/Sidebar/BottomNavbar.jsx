import React, { useEffect, useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { getSideBarMenuContent } from "../../LeftPaneldata";
import { useSelector } from "react-redux";
import { tabsClasses } from "@mui/material/Tabs";

const BottomNavBar = () => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const [menuToBeRendered, setMenuToBeRendered] = useState([]);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const fetchMenu = async () => {
      const sidebar = await getSideBarMenuContent(user);
      setMenuToBeRendered(sidebar);
    };
    fetchMenu();
  }, [user]);

  // Sync tab value with the current path
  useEffect(() => {
    const currentIndex = menuToBeRendered.findIndex(
      (item) => item.path === location.pathname
    );
    if (currentIndex !== -1) {
      setValue(currentIndex);
    }
  }, [location.pathname, menuToBeRendered]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        backgroundColor: "#fff",
        boxShadow: "0px -2px 10px rgba(0,0,0,0.1)",
        zIndex: 1000,
        backgroundImage: `linear-gradient(
          to left,
          var(--linear-gradient-main-2),
          var(--linear-gradient-main)
        )`,
      }}
    >
      {menuToBeRendered?.length > 0 && (
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          // scrollButtons
          scrollButtons
          allowScrollButtonsMobile
          TabScrollButtonProps
          aria-label="scrollable tabs for navigation"
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              "&.Mui-disabled": { opacity: 0.3 },
            },
            "& .MuiTab-root": {
              minWidth: "50px",
            },
            "& .MuiTabs-flexContainer": {
              justifyContent: "space-evenly",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#000",
              height: "4px",
              bottom: "2px",
            },
            "& .MuiTabScrollButton-root svg": {
              color: "#000",
              width: "2em",
              height: "2em",
            },
          }}
        >
          {menuToBeRendered.map((item, index) => (
            <Tab
              key={item.id}
              icon={React.createElement(item.icon)}
              label={item.label}
              wrapped
              variant="NavLink"
              component={NavLink}
              to={item.path}
              sx={{
                color: "#fff",
                "&.Mui-selected": {
                  color: "#000",
                },
              }}
            />
          ))}
        </Tabs>
      )}
    </Box>
  );
};

export default BottomNavBar;
