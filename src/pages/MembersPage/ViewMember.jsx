import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Grid,
  Paper,
  styled,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";

const ViewMember = ({id}) => {
  //const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/v1/user/${id}`);
        const result = response.data.data;

        // Format data (directly mapping committees since it's already an array)
        const formattedData = {
          id: result.id,
          fullname: result.fullname,
          email: result.email,
          phoneNumber: result.phoneNumber,
          avatarPath: result.avatarPath,
          committees: result.committees,
        };

        setUserData(formattedData);
      } catch (error) {
        toast.error("Failed to fetch user data.");
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!userData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="textSecondary">
          No user data found.
        </Typography>
      </Box>
    );
  }

  return (
    <div className="pop-content w-100">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="center"
        >
          {/* User Avatar and Basic Details */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            width="100%"
            mb={4}
          >
            <Avatar
              src={`http://localhost:9000/${userData.avatarPath}`}
              alt={userData.fullname}
              sx={{
                width: 150,
                height: 150,
                border: "5px solid #3f51b5",
                mb: 2,
              }}
            />
            <Typography variant="h4" fontWeight="bold">
              {userData.fullname}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {userData.email}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Phone: {userData.phoneNumber}
            </Typography>
          </Box>

          {/* Committees Section */}
          <Box
            width="100%"
            maxWidth="800px"
            bgcolor="#fff"
            p={4}
            borderRadius={2}
            boxShadow={2}
          >
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Committees
            </Typography>
            {userData.committees.length > 0 ? (
              <Grid container spacing={2}>
                {userData.committees.map((committee, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box
                      bgcolor="#e8eaf6"
                      p={2}
                      borderRadius={1}
                      textAlign="center"
                      fontWeight="bold"
                    >
                      {committee}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No committees assigned.
              </Typography>
            )}
          </Box>
        </Box>
    </div>
  );
};

export default ViewMember;
