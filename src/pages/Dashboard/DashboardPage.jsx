import React from "react";
import CalendarPage from "../CalendarPage/CalendarPage";
import { useSelector } from "react-redux";
import AdminDashboard from "./AdminDashboard";

const DashboardPage = () => {
  const { user } = useSelector((state) => state.user);
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
