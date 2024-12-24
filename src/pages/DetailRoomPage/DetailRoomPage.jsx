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
  Tooltip,
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
import { LocationOnOutlinedIcon } from "../../components/Common Components/CustomButton/CustomIcon";
import { timeDifference } from "../../utils/utils";
import BarCode from "../BarCodePage/BarCode";

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
  { field: "subject", headerName: "Subject", width: 150 },
  { field: "agenda", headerName: "Agenda", width: 100,
    renderCell: (params) => {
      // Hide cell content for specific rows
      return params.row.private === true ? '---' : <span>{params.value}</span>;
  },
   },
  { field: "notes", headerName: "Notes", width: 100,
    renderCell: (params) => {
      // Hide cell content for specific rows
      return params.row.private === true ? '---' : <span>{params.value}</span>;
  },
   },
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
  const [meeting, setMeeting] = useState([]);
    const [refreshPage, setRefreshPage] = useState("");
    const [urlData, setUrlData] = React.useState("Not Found");
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/v1/rooms/${id}`);
      setRoom(response.data.data.room[0]);

    } catch (error) {
      console.error(error);
    }
  };

  const getAllMeeting = () => {
    const meeting = room?.Meetings.map((meeting) => {
      const timeDiff = timeDifference(meeting?.startTime,meeting?.endTime)

      return {
        id: meeting.id,
        subject: meeting.subject,
        agenda: meeting.agenda,
        private: meeting.isPrivate,
        notes: meeting.notes,
        startTime: meeting.startTime,
        endTime: meeting.endTime, // 45 minutes duration
        duration: timeDiff,
        organizerName: meeting.User.fullname,
        status: meeting.status,
      };
    });
    setMeeting(meeting);
  };
  useEffect(() => {
    fetchData();
  }, [id,refreshPage]);

  setTimeout(()=>{
    setRefreshPage(Math.random())
  },10000)

  useEffect(() => {
    getAllMeeting();
    setUrlData(`${import.meta.env.VITE_APPLICATION_URL}/rooms/${room?.id}`)
  }, [id,room]);
  if (!room) {
    return <p>Loading...</p>;
  }

  const handleBookNow = () => {
    navigate(`/book-meeting/${id}`);
  };
  console.log(meeting)
  console.log(room)
  return (
    <ContentWrapper>
      <Typography variant="h4" component="h4" textAlign="center">
        {room.name}
      </Typography>
      <div className="wrapper">
        <div className="imageWrapper">
          <Carousel roomImagesForCarousel={room?.RoomGalleries} />
        </div>
        <div className="tableWrapper flex-1">
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={meeting}
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
            width: "25%",
          }}
        >
          <Divider>
            <Chip label="Amenities" size="large" fontSize="20px" />
          </Divider>
          <Box display="flex" justifyContent="center">
            <div className="marquee">
              <div className="marquee-content">
                {room.RoomAmenityQuantities &&
                  room.RoomAmenityQuantities?.map((amenity) => (
                    <Chip
                      key={amenity.RoomAmenity.id}
                      label={amenity.RoomAmenity.name}
                      size="large"
                    />
                  ))}
              </div>
            </div>
          </Box>
        </Box>

        <Divider
          variant="fullWidth"
          orientation="vertical"
          flexItem
          sx={{ height: "50%", marginTop: "30px" }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            height: "30vh",
            width: "25%",
          }}
        >
          <Divider>
            <Chip label="Food & Beverage" size="large" fontSize="20px" />
          </Divider>
          <Box justifyContent="center">
            <div className="marquee">
              <div className="marquee-content">
                {room.RoomFoodBeverages &&
                  room.RoomFoodBeverages?.map((amenity) => (
                    <Chip
                      key={amenity.FoodBeverage.id}
                      label={amenity.FoodBeverage.foodBeverageName}
                      size="large"
                    />
                  ))}
              </div>
            </div>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            height: "30vh",
            width: "25%",
          }}
        >
          <Divider>
            <Chip label="Bar Code" size="large" fontSize="20px" />
          </Divider>
          <Box justifyContent="center">
            
              <BarCode urlData={urlData} />
             
          </Box>
        </Box>

        <Divider
          variant="fullWidth"
          orientation="vertical"
          flexItem
          sx={{ height: "50%", marginTop: "30px" }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            height: "40vh",
            width: "25%",
          }}
        >
          <Divider>
            <Chip label="Room Detail" size="large" fontSize="20px" />
          </Divider>
          <Box
            display="flex"
            justifyContent="left"
            gap="50px"
            alignItems="flex-end"
          >
            <Typography component="p">
              <Tooltip title="Capacity">
                <GroupsIcon fontSize="small" />
              </Tooltip>{" "}
              {room.capacity} people
            </Typography>

            <Typography component="p">
              <Tooltip title="Tolerance Period">
                <AccessTimeIcon fontSize="small" />
              </Tooltip>{" "}
              {room.tolerancePeriod} mins
            </Typography>

            <Typography component="p">
              <Tooltip title="Sanitation">
                {room.sanitationStatus ? (
                  <CheckCircleOutlineOutlinedIcon fontSize="small" />
                ) : (
                  <CancelOutlinedIcon fontSize="small" />
                )}
              </Tooltip>{" "}
              Sanitation
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="left"
            gap="50px"
            alignItems="flex-end"
          >
            <Typography component="p">
              <Tooltip title="Location">
                <LocationOnOutlinedIcon />
              </Tooltip>{" "}
              {room.Location.locationName}
            </Typography>

            <Typography component="p">
              <Tooltip title="SanitationPeriod Period">
                <AccessTimeIcon fontSize="small" />
              </Tooltip>{" "}
              {room.sanitationPeriod} mins
            </Typography>
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

