import React, { useEffect } from "react";
import CalendarPage from "../CalendarPage/CalendarPage";
import { useSelector } from "react-redux";
import AdminDashboard from "./AdminDashboard";
import { useLocation } from "react-router-dom";
import { handleStartGuide } from "../../utils/utils";
import { useMediaQuery } from "@mui/material";

const DashboardPage = () => {
  const { user } = useSelector((state) => state.user);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const location = useLocation();
  const isAdmin = user?.UserType?.isAdmin === 'admin';

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenDashboard");
      if(user && !user.lastLoggedIn && (hasSeenTour === "false" || hasSeenTour === null)){
        handleStartGuide(location, isSmallScreen, isAdmin);
        localStorage.setItem("hasSeenDashboard", "true");
      }
  }, [])


  return (
    <div>
      {user?.UserType?.isAdmin === "admin" ? (
        <AdminDashboard />
      ) : (
        <CalendarPage />
      )}
    </div>
  );
};

export default DashboardPage;
