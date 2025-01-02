import React, { useEffect, useState } from "react";
import { setUser } from "../../Redux/authSlicer";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Loader from "../Common Components/Loader/Loader";

const ProtectedRoutes = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const getUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/user/my-profile`,
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
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoutes;
