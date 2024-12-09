import React, { useEffect, useState } from "react";
import { setUser } from "../../Redux/authSlicer";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoutes = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const getUser = async () => {
    try {
      const response = await axios.get(
        "${import.meta.env.VITE_API_URL}/api/v1/user/my-profile",
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        dispatch(setUser(response.data.data));
      }
    } catch (error) {
      console.log("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      getUser();
    } else {
      setLoading(false); // Ensure we stop loading once user is available
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>; // Optionally show a loader while checking auth
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoutes;
