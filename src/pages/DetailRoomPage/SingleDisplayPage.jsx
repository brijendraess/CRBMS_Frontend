import {
  Box,
  LinearProgress,
  Paper,
  styled,
  Typography,
  Button,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import flag2 from "../../assets/flag2.webp";
import flag from "../../assets/flag.png";

import Carousel from "../../components/Carousel/Carousel";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import Loader from "../../components/Common Components/Loader/Loader";
import { LocationOnOutlinedIcon } from "../../components/Common Components/CustomButton/CustomIcon";
import { getMeetingTimePercentage, timeDifference } from "../../utils/utils";
import { DataGrid } from "@mui/x-data-grid";
import GroupsIcon from "@mui/icons-material/Groups";
import axios from "axios";
import { createTheme } from "@mui/material/styles";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import { FullscreenOutlined } from "@mui/icons-material";

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "start",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  overflowY: "auto",
  overflowX: "hidden",
  height: "100%",
  textAlign: "left",
  alignItems: "center",
}));

const theme = createTheme({
  palette: {
    progress: {
      color10: "#FF0000", // Red
      color20: "#FF3300",
      color30: "#FF6600",
      color40: "#FF9900",
      color50: "#FFCC00",
      color60: "#FFFF00",
      color70: "#CCFF00", // Yellow
      color80: "#99FF00",
      color90: "#66FF00",
      color100: "#33FF00", // Green
    },
  },
});

const columns = [
  {
    field: "subject",
    headerName: "Subject",
    width: 200,
    flex: 1,
    headerClassName: "super-app-theme--header",
  },
  {
    field: "startTime",
    headerName: "Start Time",
    width: 125,
    headerClassName: "super-app-theme--header",
  },
  {
    field: "endTime",
    headerName: "End Time",
    width: 100,
    headerClassName: "super-app-theme--header",
  },

  {
    field: "organizerName",
    headerName: "Organizer",
    width: 200,
    headerClassName: "super-app-theme--header",
  },
  {
    field: "status",
    headerName: "Status",
    width: 206,
    renderCell: (params) => renderProgressBar(params),
    headerClassName: "super-app-theme--header",
  },
];

const renderProgressBar = (params) => {
  const status = params.row.status;
  const meetingStartTime = `${params.row.meetingDate}T${params.row.startTime}Z`; // ISO 8601 format
  const meetingEndTime = `${params.row.meetingDate}T${params.row.endTime}Z`;
  const percentage = getMeetingTimePercentage(meetingStartTime, meetingEndTime);
  let progress = 0;

  if (status === "Completed") progress = percentage;
  else if (status === "ongoing") progress = percentage;
  else if (status === "Scheduled") progress = 0;

  const getCustomColor = (percentage) => {
    if (percentage >= 0 && percentage <= 10)
      return theme.palette.progress.color10;
    if (percentage >= 11 && percentage <= 20)
      return theme.palette.progress.color20;
    if (percentage >= 21 && percentage <= 30)
      return theme.palette.progress.color30;
    if (percentage >= 31 && percentage <= 40)
      return theme.palette.progress.color40;
    if (percentage >= 41 && percentage <= 50)
      return theme.palette.progress.color50;

    if (percentage >= 51 && percentage <= 60)
      return theme.palette.progress.color60;
    if (percentage >= 61 && percentage <= 70)
      return theme.palette.progress.color70;
    if (percentage >= 71 && percentage <= 80)
      return theme.palette.progress.color80;
    if (percentage >= 81 && percentage <= 90)
      return theme.palette.progress.color90;
    if (percentage >= 91 && percentage <= 100)
      return theme.palette.progress.color100;
  };

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
          sx={{
            height: 20, // Increased thickness
            borderRadius: 6, // Rounded edges
            "& .MuiLinearProgress-bar": {
              backgroundColor: getCustomColor(percentage),
            },
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

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  lineHeight: "60px",
  background: "rgba(251, 251, 251, 0)",
  backdropFilter: "blur(2px)",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.33)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  borderRadius: "20px",
  overflow: "hidden",
  color: "#fff",
}));

const SingleDisplayPage = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [meeting, setMeeting] = useState([]);
  const [refreshPage, setRefreshPage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreen = () => {
    const elem = document.documentElement;

    if (!isFullScreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      }
    }
    setIsFullScreen(!isFullScreen); // Toggle State
  };
  const fetchData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(`/api/v1/rooms/${id}`);
      setRoom(response.data.data.room[0]);
      console.log(response.data.data.room[0]);
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
    }
  };

  const getAllMeeting = () => {
    const meeting = room?.Meetings.map((meeting) => {
      const timeDiff = timeDifference(meeting?.startTime, meeting?.endTime);

      return {
        id: meeting.id,
        subject: meeting.subject,
        agenda: meeting.agenda,
        private: meeting.isPrivate,
        notes: meeting.notes,
        startTime: meeting.startTime,
        meetingDate: meeting.meetingDate,
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
  }, [id]);

  setTimeout(() => {
    setRefreshPage(Math.random());
  }, 10000);

  useEffect(() => {
    getAllMeeting();
  }, [id, room,refreshPage]);
  if (!room) {
    return <Loader />;
  }
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        flexDirection: "column",
        backgroundImage: `
        linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
        url(${flag2})
      `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "10px",
        gap: "10px",
        borderBottom: "10px solid transparent",
        borderTop: "10px solid transparent",
        borderImage:
          "linear-gradient(to right, #006400, #ffffff, #ff0000, rgb(158, 24, 24)) 1",
      }}
    >
      <Item
        style={{
          display: "flex",
          height: "8vh",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        elevation={24}
      >
        <Box
          width="75px"
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <img
            src={flag}
            alt=""
            style={{
              width: "75px",
              height: "50px",
            }}
          />
        </Box>
        <Typography
          variant="h4"
          component="h4"
          style={{
            fontSize: "3.5rem",
            fontWeight: "bold",
            backgroundClip: "text",
            display: "inline-block",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            transform: "scale(0.8)",
            transformOrigin: "center",
            color: "transparent",
            backgroundImage:
              "linear-gradient(to right, #006400, #ffffff, #ff0000,rgb(158, 24, 24))",
            WebkitBackgroundClip: "text",
            // textShadow: `
            //   2px 2px 0 green, 
            //   4px 4px 0 rgba(191, 191, 191, 0.5), 
            //   6px 6px 0 rgba(88, 88, 88, 0.3)
            // `,
          }}
        >
          {room.name}
        </Typography>

        <Button style={{ color: "white" }} onClick={handleFullScreen}>
          <Tooltip title="Full Screen">
            {isFullScreen ? <FullscreenExitOutlinedIcon /> : <FullscreenOutlined />}
          </Tooltip>
        </Button>
      </Item>
      <Box
        style={{
          display: "flex",
          height: "92vh",
          width: "100%",
          gap: "10px",
        }}
      >
        <Box
          style={{
            width: "40%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Item style={{ width: "100%", height: "50%" }}>
            <Carousel roomImagesForCarousel={room?.RoomGalleries} />
          </Item>
          <Item style={{ width: "100%", height: "50%", padding: "10px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body"
                fontWeight="500"
                fontSize="14px"
                gap={1}
                display={"flex"}
                alignItems={"center"}
              >
                <LocationOnOutlinedIcon fontSize="medium" />
                {room?.Location?.locationName}
              </Typography>

              <Typography
                variant="body"
                fontSize={"14px"}
                fontWeight={"500"}
                gap={1}
                display={"flex"}
                alignItems={"center"}
              >
                <GroupsIcon fontSize="medium" />
                {room.capacity} people
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                width: "100%",
              }}
            >
              <Wrapper>
                <Typography
                  variant="h6"
                  component="h6"
                  fontSize={"17px"}
                  fontWeight="700"
                >
                  Amenities:
                </Typography>
                {room.RoomAmenityQuantities &&
                  room.RoomAmenityQuantities.map((amenity) => (
                    <Typography key={amenity.RoomAmenity.id} fontSize={"15px"}>
                      <b>|</b> {amenity.RoomAmenity.name} <b>|</b>
                    </Typography>
                  ))}
              </Wrapper>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                width: "100%",
              }}
            >
              <Wrapper>
                <Typography
                  variant="h6"
                  component="h6"
                  fontSize={"17px"}
                  fontWeight="700"
                >
                  Food Beverages:
                </Typography>
                {room.RoomFoodBeverages &&
                  room.RoomFoodBeverages.map((food) => (
                    <Typography key={food.FoodBeverage.id} fontSize={"15px"}>
                      <b>|</b> {food.FoodBeverage.foodBeverageName} <b>|</b>
                    </Typography>
                  ))}
              </Wrapper>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                width: "100%",
              }}
            >
              <Wrapper>
                <Typography
                  variant="h6"
                  component="h6"
                  fontSize={"17px"}
                  fontWeight="700"
                >
                  Description:
                </Typography>
                <Typography fontSize={"15px"}>{room.description}</Typography>
              </Wrapper>
            </Box>
          </Item>
        </Box>
        <Item
          style={{
            width: "60%",
            height: "100%",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <DataGrid
              rows={meeting}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[]}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.26)",
                backdropFilter: "blur(5px)",
                // borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",

                "& .MuiDataGrid-footerContainer": {
                  display: "none", // Hides footer
                },

                // Header styles
                "& .super-app-theme--header": {
                  backgroundColor: "rgba(255, 223, 0, 1)",
                  color: "red",
                  fontWeight: "600",
                  fontSize: "16px",
                },

                // Row styles
                "& .MuiDataGrid-row": {
                  "&:nth-of-type(odd)": {
                    backgroundColor: "rgba(93, 220, 205, 0.15)",
                  },
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "15px",
                },

                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "rgba(0, 150, 136, 0.2)",
                },
              }}
            />
          </Box>
        </Item>
      </Box>
    </div>
  );
};

export default SingleDisplayPage;
