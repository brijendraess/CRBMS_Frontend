import React, { useEffect, useState, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  LinearProgress,
  styled,
  Paper,
  Button,
} from "@mui/material";
import "./TodaysMeetings.css";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import flag2 from "../../assets/flag2.webp";
import dayjs from "dayjs";
import durationPlugin from "dayjs/plugin/duration";
import axios from "axios";
import { getFormattedDate, getMeetingTimePercentage, timeDifference } from "../../utils/utils";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
dayjs.extend(durationPlugin);

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


const colorMap = {
  A: { row: "#ffecec", bar: "#ff4d4d" }, // Light Red
  B: { row: "#fff5e6", bar: "#ffa500" }, // Light Orange
  C: { row: "#ffffe6", bar: "#ffd700" }, // Light Yellow
  D: { row: "#e6faff", bar: "#00bfff" }, // Light Blue
  E: { row: "#e8f5e9", bar: "#4caf50" }, // Light Green
};

const getColorByProgress = (progress) => {
  if (progress <= 20) return colorMap.A;
  if (progress <= 40) return colorMap.B;
  if (progress <= 60) return colorMap.C;
  if (progress <= 80) return colorMap.D;
  return colorMap.E;
};

const renderProgressBar = (params) => {
  const status = params.row.status;
   const meetingStartTime = `${params.row.meetingDate}T${params.row.startTime}Z`; // ISO 8601 format
   const meetingEndTime = `${params.row.meetingDate}T${params.row.endTime}Z`;
   const percentage = getMeetingTimePercentage(meetingStartTime, meetingEndTime);
   let progress = 0;

  if (status === "Completed") progress = percentage;
  else if (status === "start") progress = percentage;
  else if (status === "scheduled") progress = 0;

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
      <Box sx={{ position: "relative", width: "90%" }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 20,
            borderRadius: 5,
            "& .MuiLinearProgress-bar": {
              backgroundColor: getCustomColor(percentage),
            },
          }}
        />
        <Typography
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#000", // White text on the bar
            fontSize: "0.85rem",
            fontWeight: "bold",
          }}
        >
          {`${progress}%`}
        </Typography>
      </Box>
    </Box>
  );
};

const TodaysMeetings = () => {
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

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayDate, setTodayDate] = useState("");
  const [refreshPage, setRefreshPage] = useState("");
  const [room, setRoom] = useState(null);
  const gridRef = useRef(null);
  const dispatch = useDispatch();
  const fetchData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(`/api/v1/rooms/all-meeting`);
      const todayDate = getFormattedDate();
      setTodayDate(todayDate);
      setRoom(
        response.data.data.meeting.filter(
          (meet) => meet.meetingDate === todayDate
        )
      );
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshPage]);

  // setTimeout(() => {
  //   setRefreshPage(Math.random());
  // }, 10000);

  const generateFakeMeetings = () => {
    const meetings = [];
    const baseStartTime = "09:00:00";
    const meetingDate = todayDate;

    room?.map((meeting) => {
      let startTime = dayjs(`${meetingDate}T${meeting.startTime}`);
      const endTime = dayjs(`${meetingDate}T${meeting.endTime}`);
      const timeDiff = timeDifference(meeting?.startTime, meeting?.endTime);

      meetings.push({
        meetingId: meeting.id,
        subject: meeting.subject,
        agenda: meeting.agenda,
        private: meeting.isPrivate,
        notes: meeting.notes,
        meetingDate: meetingDate,
        startTime: startTime.format("HH:mm"),
        endTime: endTime.format("HH:mm"),
        duration: timeDiff,
        roomName: meeting.Room.name,
        roomLocation: meeting.Room.Location.locationName,
        organizerName: meeting.User.fullname,
        progress: Math.floor(Math.random() * 101),
      });

      startTime = endTime.add(15, "minute");
    });
    return meetings;
  };

  useEffect(() => {
    setMeetings(generateFakeMeetings());
    setLoading(false);
  }, [room]);

  useEffect(() => {
    let scrollInterval;

    if (gridRef.current) {
      const scrollContainer = gridRef.current.querySelector(
        ".MuiDataGrid-virtualScroller"
      );

      if (scrollContainer) {
        // Start scrolling after a 2-second delay
        setTimeout(() => {
          let initialScrollSpeed = 1; // Slow speed for the first few rows
          let normalScrollSpeed = 2; // Regular speed

          scrollInterval = setInterval(() => {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainer;

            if (scrollTop + clientHeight >= scrollHeight) {
              // Reset to top if at the bottom
              scrollContainer.scrollTop = 0;
              initialScrollSpeed = 1; // Reset speed for the top
            } else {
              // Gradually increase speed after the first few rows
              if (scrollTop < 150) {
                scrollContainer.scrollTop += initialScrollSpeed;
              } else {
                scrollContainer.scrollTop += normalScrollSpeed;
              }
            }
          }, 20); // Adjust the interval for speed
        }, 2000); // 2-second delay before starting scrolling
      }
    }

    return () => clearInterval(scrollInterval);
  }, []);

  const columns = [
    {
      field: "subject",
      headerName: "Subject",
      maxWidth: 100,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "roomName",
      headerName: "Room",
      width: 400,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "roomLocation",
      headerName: "Location",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "startTime",
      headerName: "Start",
      width: 100,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "endTime",
      headerName: "End",
      width: 100,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "duration",
      headerName: "Duration",
      width: 125,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "organizerName",
      headerName: "Organizer",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "progress",
      headerName: "Time Remaining",
      width: 260,
      renderCell: renderProgressBar,
      headerClassName: "super-app-theme--header",
    },
    // {
    //   field: "",
    //   headerName: (
    //     <Button style={{ color: "BLACK" }} onClick={handleFullScreen}>
    //       {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
    //     </Button>
    //   ),
    //   width: 100,
    //   headerClassName: "super-app-theme--header",
    // },
  ];

  return (
    <Box
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
        border: "12px solid transparent",
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
      >
        <Typography
          variant="h4"
          component="h4"
          textAlign={"center"}
          width={"90%"}
          fontWeight="700"
        >
          Today's Meeting
        </Typography>
        <Button style={{ color: "BLACK" }} onClick={handleFullScreen}>
          {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </Button>
      </Item>
      <Item
        style={{
          display: "flex",
          height: "92vh",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        elevation={24}
      >
        <DataGrid
          ref={gridRef}
          rows={meetings}
          columns={columns}
          disableSelectionOnClick
          getRowId={(row) => row.meetingId}
          loading={loading}
          hideFooterPagination // Hide pagination controls
          rowHeight={40}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.26)",
            backdropFilter: "blur(5px)",
            // borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            flexGrow: 1,
            "& .super-app-theme--header": {
              backgroundColor: "rgba(255, 223, 0, 1)",
              color: "red",
              fontWeight: "700",
              fontSize: "18px",
            },
            "& .MuiDataGrid-footerContainer": {
              display: "none", // Hides footer
            },
            "& .MuiDataGrid-row": {
              "&:nth-of-type(odd)": {
                backgroundColor: "rgba(93, 220, 205, 0.15)",
              },
              color: "#fff",
              fontWeight: "700",
              fontSize: "18px",
            },
          }}
        />
      </Item>
    </Box>
  );
};

export default TodaysMeetings;
