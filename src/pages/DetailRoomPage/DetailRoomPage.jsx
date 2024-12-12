import React, { useEffect, useState } from "react";
import "./DetailRoomPage.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Chip,
  Divider,
  Paper,
  styled,
  LinearProgress,
  Typography,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { meetings } from "../../data";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import Carousel from "../../components/Carousel/Carousel";

const ContentWrapper = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  height: "100vh",
  width: "100%",
  lineHeight: "60px",
  padding: "10px",
}));

const columns = [
  { field: "title", headerName: "Title", width: 200 },
  {
    field: "startTime",
    headerName: "Start Time",
    width: 125,
  },
  {
    field: "endTime",
    headerName: "End Time",
    width: 125,
  },
  { field: "organizerName", headerName: "Organizer", width: 200 },
  {
    field: "status",
    headerName: "Status",
    width: 200,
    renderCell: (params) => renderProgressBar(params),
  },
];

const renderProgressBar = (params) => {
  const status = params.value;
  let progress = 0;

  // Determine progress percentage based on status
  if (status === "Completed") progress = 100;
  else if (status === "In Progress") progress = 33;
  else if (status === "Scheduled") progress = 0;

  // Determine color based on progress percentage
  let color = "success"; // Green for < 33%
  if (progress >= 33 && progress <= 66) color = "info"; // Blue for 33%-66%
  if (progress > 66) color = "error"; // Red for > 66%

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center", // Center the progress bar horizontally
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        sx={{
          position: "relative", // Needed for placing text inside the bar
          width: "90%", // Occupies 90% of the cell width
        }}
      >
        <LinearProgress
          variant="determinate"
          value={progress}
          color={color}
          sx={{
            height: 20, // Increased thickness
            borderRadius: 6, // Rounded edges
          }}
        />
        <Typography
          sx={{
            position: "absolute", // Position the text inside the bar
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // Center the text within the bar
            color: "white", // Ensure text is visible
            fontSize: "0.75rem",
            fontWeight: "bold",
          }}
        >
          {`${progress}%`}
        </Typography>
      </Box>
    </Box>
  );
};

const DetailRoomPage = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/v1/rooms/${id}`);
      setRoom(response.data.data.room);
      console.log(response.data.data.room);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (!room) {
    return <p>Room not found</p>;
  }

  // Check if amenities is an array or a string and handle accordingly
  let amenitiesList = [];
  if (Array.isArray(room.amenities)) {
    amenitiesList = room.amenities; // If it's already an array
  } else if (typeof room.amenities === "string") {
    amenitiesList = room.amenities.split(","); // If it's a string, split it
  }

  const handleBookNow = () => {
    // take id and navigate to /book-meeting
    navigate(`/book-meeting/${id}`);
  };

  return (
    <ContentWrapper>
      <Carousel />
    </ContentWrapper>
  );
};

export default DetailRoomPage;
// <Box sx={{ width: "100%", display: "flex", alignItems: "flex-end" }}>
//   <Button variant="contained" sx={{ marginTop: "50px" }}>
//     Request Room
//   </Button>
// </Box>
{
  /* <div className="wrapper">
  <div className="w-100 d-flex flex-row gap-5">
    <div className="imageWrapper flex-1">
      <Carousel />
      <div className="infoWrapper d-flex flex-1">
        <h2>{room.name}</h2>
        <Divider textAlign="left" variant="fullWidth">
          <Chip label={`Capacity: ${room.capacity} People`} size="large" />
        </Divider>
        <h4></h4>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {amenitiesList.length > 0 ? (
            amenitiesList.map((amenity, index) => (
              <Chip key={index} label={amenity.trim()} size="medium" />
            ))
          ) : (
            <Chip label={"No amenities listed"} size="large" />
          )}
        </Box>
      </div>
    </div>
    <div className="imageWrapper flex-1">
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={meetings}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>
    </div>
  </div>
</div>; */
}
