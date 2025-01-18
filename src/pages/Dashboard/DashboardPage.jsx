import React from 'react'
import CalenderPage from '../CalenderPage/CalenderPage'
import { useSelector } from "react-redux";
import AdminDashboard from './AdminDashboard';

const DashboardPage = () => {

  const { user } = useSelector((state) => state.user);
  return (
    <div>
      {user?.UserType?.isAdmin==='admin'?
      <AdminDashboard />
      :<CalenderPage />}
    </div>
  )
}

export default DashboardPage