import React, { createContext, useState } from "react";
import "./Layout.css";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

export const MyContext = createContext();

const Layout = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  return (
    <>
      <MyContext.Provider value={{ isSidebarVisible, setIsSidebarVisible }}>
        <Header />
        <div className="main">
          <div
            className={` ${isSidebarVisible === true ? "sidebarWrapper-toggle" : "sidebarWrapper"}`}
          >
            <Sidebar />
          </div>
          <main
            className={`${isSidebarVisible === true ? "contentToggle" : "content"}`}
          >
            <div className="outlet-content" >
              <Outlet />
            </div>
          </main>
        </div>
      </MyContext.Provider>
    </>
  );
};

export default Layout;
