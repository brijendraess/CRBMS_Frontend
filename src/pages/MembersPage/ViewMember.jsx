import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Grid2,
  Chip,
  Divider,
  Paper,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { PopContent } from "../../Style";

const ViewMember = ({ id }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get(`/api/v1/user/${id}`);
        const result = response.data.data;
        const formattedData = {
          id: result.id,
          fullname: result?.fullname,
          userDescription: result.userDescription,
          email: result.email,
          phoneNumber: result.phoneNumber,
          avatarPath: result.avatarPath,
          committees: result.committees,
          committeeType: result.committeeType,
          services: result.services,
        };
        console.log(formattedData)

        setUserData(formattedData);
        dispatch(hideLoading());
      } catch (error) {
        dispatch(hideLoading());
        toast.error("Failed to fetch user data.");
        console.error("Error fetching user data:", error);
      } finally {
        dispatch(hideLoading());
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
    <PopContent>
      <Paper
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "500px",
          padding: '8px'
        }}
        elevation={20}
      >
        <Avatar
          src={`${import.meta.env.VITE_API_URL}/${userData.avatarPath}`}
          alt={userData.fullname}
          sx={{
            width: 150,
            height: 150,
            border: "5px solid #3f51b5",
            mb: 2,
          }}
        />
        {/* <Box> */}
        <Typography
          variant="h6"
          component="h6"
          style={{
            fontSize: "20px",
            fontWeight: 500,
            lineHeight: 1.6,
          }}
        >
          {userData.fullname}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {userData.email}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {userData.phoneNumber}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {userData.services}
        </Typography>
        {/* </Box> */}
      </Paper>
      <Paper sx={{
        display: "flex",
        width: "500px",
        padding: '8px',
        mt: '10px',
        height: '150px',
        overflow: 'scroll'
      }}
        elevation={20}>
        <Typography variant="body1" color="textSecondary" textAlign='left' >
          <b>Description:</b> {userData.userDescription}
        </Typography>
      </Paper>

      <Paper sx={{
        width: '100%',
        maxWidth: '800px',
        marginTop: '10px',
        padding: '8px',
        maxHeight: '200px',
        overflow: 'scroll'
      }}
        elevation={20}
      >
        <Divider textAlign="center">
          <Chip label="Committee" size="large" />
        </Divider>
        {userData.committees && userData.committees.length > 0 ? (
          <div style={{ maxHeight: "120px", overflow: "scroll" }}>
            <Grid2 container spacing={2} mt={3}>
              {userData.committees.map((committee, index) => (
                <Grid2 item xs={12} sm={6} md={4} key={index}>
                  <Chip label={committee} variant="outlined" />
                </Grid2>
              ))}
            </Grid2>
          </div>
        ) : (
          <Typography variant="body2" color="textSecondary" mt={3}>
            No committees assigned.
          </Typography>
        )}
      </Paper>
    </PopContent>
  );
};

export default ViewMember;
