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
import { meetings } from "../../LeftPaneldata";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import Carousel from "../../components/Carousel/Carousel";
import GroupsIcon from "@mui/icons-material/Groups";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const ContentWrapper = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  height: "100vh",
  width: "100%",
  lineHeight: "60px",
  padding: "10px",
  display: "flex",
  flexDirection: "column",
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
  const [roomImagesForCarousel, setRoomImagesForCarousel] = useState([]);
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
  const fetchRoomImages = async () => {
    try {
      const response = await axios.get(
        `/api/v1/rooms/single-room-gallery/${id}`
      );
      setRoomImagesForCarousel(response.data.data.roomGallery);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchRoomImages();
  }, [id]);

  if (!room) {
    return <p>Room not found</p>;
  }

  let amenitiesList = [];
  if (Array.isArray(room.amenities)) {
    amenitiesList = room.amenities;
  } else if (typeof room.amenities === "string") {
    amenitiesList = room.amenities.split(",");
  }

  const handleBookNow = () => {
    navigate(`/book-meeting/${id}`);
  };

  return (
    <ContentWrapper>
      <Typography variant="h4" component="h4" textAlign="center">
        {room.name}
      </Typography>
      <div className="wrapper">
        <div className="imageWrapper">
          <Carousel roomImagesForCarousel={roomImagesForCarousel} />
        </div>
        <div className="tableWrapper flex-1">
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          gap: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            height: "30vh",
            width: "50%",
          }}
        >
          <Divider>
            <Chip label="Amenities" size="large" fontSize="20px" />
          </Divider>
          <Box display="flex" justifyContent="center">
            <div className="marquee">
              <div className="marquee-content">
                <Chip label="Amenity 1" size="large" />
                <Chip label="Amenity 2" size="large" />
                <Chip label="Amenity 3" size="large" />
                <Chip label="Amenity 4" size="large" />
                <Chip label="Amenity 5" size="large" />
                <Chip label="Amenity 6" size="large" />
              </div>
            </div>
          </Box>
        </Box>

        <Divider variant="fullWidth" orientation="vertical" flexItem />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          width="50%"
          gap={"10px"}
        >
          <Box
            display="flex"
            justifyContent="center"
            gap="10px"
            alignItems="flex-end"
          >
            <Typography variant="h5" component="h5">
              {room.capacity}
            </Typography>
            <GroupsIcon fontSize="large" />
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            gap="10px"
            alignItems="flex-end"
          >
            <Typography variant="h6" component="h6">
              Tolerance Period : {room.tolerancePeriod} mins
            </Typography>
            <AccessTimeIcon fontSize="large" />
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            gap="10px"
            alignItems="flex-end"
          >
            <Typography variant="h6" component="h6">
              Sanitation
            </Typography>
            {room.sanitationStatus ? (
              <CheckCircleOutlineOutlinedIcon fontSize="large" />
            ) : (
              <CancelOutlinedIcon fontSize="large" />
            )}
          </Box>
          <Typography variant="body1" component="body1">
            {room.description}
          </Typography>
        </Box>
      </Box>
    </ContentWrapper>
  );
};

export default DetailRoomPage;

// <Box sx={{ width: "100%", display: "flex", alignItems: "flex-end" }}>
//   <Button variant="contained" sx={{ marginTop: "50px" }}>
//     Request Room
//   </Button>
// </Box>
