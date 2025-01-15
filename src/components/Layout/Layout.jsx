import React, { createContext, useState } from "react";
import "./Layout.css";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import BottomNavBar from "../Sidebar/BottomNavbar";
import { useMediaQuery } from "@mui/material";

export const MyContext = createContext();

const Layout = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Checks if the screen width is less than or equal to 768px (mobile view)
  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <>
      <MyContext.Provider value={{ isSidebarVisible, setIsSidebarVisible }}>
        <Header />
        <div className="main">
          {/* Sidebar for larger screens */}
          {!isMobile && (
            <div
              className={`${
                isSidebarVisible ? "sidebarWrapper-toggle" : "sidebarWrapper"
              }`}
            >
              <Sidebar />
            </div>
          )}

          {/* Bottom Navigation Bar for mobile screens */}

          {/* Main content */}
          <main
            className={`${
              isSidebarVisible && !isMobile ? "contentToggle" : "content"
            }`}
          >
            <div className="outlet-content">
              <Outlet />
            </div>
          </main>
        </div>
        {isMobile && <BottomNavBar />}
      </MyContext.Provider>
    </>
  );
};

export default Layout;
