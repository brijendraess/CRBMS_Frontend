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

  const currentPath = location.pathname;

  // Handle tab change
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
          aria-label="scrollable tabs for navigation"
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              "&.Mui-disabled": { opacity: 0.3 },
            },
            "& .MuiTab-root": {
              minWidth: "50px",
            },
          }}
        >
          {menuToBeRendered.map((item, index) => (
            <Tab
              key={item.id}
              icon={React.createElement(item.icon)}
              label={item.label}
              wrapped
              component={NavLink}
              to={item.path}
              sx={{
                color: currentPath === item.path ? "#1976d2" : "gray",
                "&.Mui-selected": {
                  color: "#1976d2",
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
