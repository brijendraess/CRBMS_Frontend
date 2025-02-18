import React, { useEffect, useState, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  styled,
  Paper,
  Button,
} from "@mui/material";
import "./TodaysMeetings.css";

// import flag2 from "../../assets/flag2.webp";
import flag2 from "../../assets/kenyaFlag.jpg";
import dayjs from "dayjs";
import durationPlugin from "dayjs/plugin/duration";
import axios from "axios";
import {
  getFormattedDate,
  timeDifference,
} from "../../utils/utils";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import {
  FullscreenExitIcon,
  FullscreenIcon,
} from "../../components/Common/Buttons/CustomIcon";
dayjs.extend(durationPlugin);

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  lineHeight: "60px",
  background: "rgba(251, 251, 251, 0)",
  backdropFilter: "blur(2px)",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.33)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  borderRadius: "4px",
  overflow: "hidden",
  color: "#fff",
}));

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
  const [allMeetings, setAllMeetings] = useState([]);

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
      console.log(response?.data?.data?.meeting, "resppp")
      setAllMeetings(response?.data?.data?.meeting);

      console.log(allMeetings, "allll")
      const meeting = response?.data?.data?.meeting?.filter((meeting) => meeting.meetingDate === todayDate && meeting.status === "scheduled").map((meeting) => {
        const timeDiff = timeDifference(meeting?.startTime, meeting?.endTime);
        return {
          id: meeting?.id,
          subject: meeting?.subject,
          agenda: meeting?.agenda,
          private: meeting?.isPrivate,
          notes: meeting?.notes,
          startTime: formatTimeTo12Hour(meeting?.startTime),  // Convert time here
          meetingDate: meeting?.meetingDate,
          endTime: formatTimeTo12Hour(meeting?.endTime),  // Convert time here
          duration: timeDiff,
          organizerName: meeting?.User?.fullname,
          status: meeting?.status,
          roomName: meeting?.Room?.name,
          roomLocation: meeting?.Room?.Location?.locationName
        };
      });
      setMeetings(meeting);
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatTimeTo12Hour = (time) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  // const getAllMeeting = () => {
  //   const todayDate = new Date().toISOString().split('T')[0];

  //   console.log(allMeetings, "allllll")
  //   const meeting = allMeetings?.filter((meeting) => meeting.meetingDate === todayDate && meeting.status === "scheduled").map((meeting) => {
  //     const timeDiff = timeDifference(meeting?.startTime, meeting?.endTime);
  //     return {
  //       id: meeting.id,
  //       subject: meeting.subject,
  //       agenda: meeting.agenda,
  //       private: meeting.isPrivate,
  //       notes: meeting.notes,
  //       startTime: formatTimeTo12Hour(meeting.startTime),  // Convert time here
  //       meetingDate: meeting.meetingDate,
  //       endTime: formatTimeTo12Hour(meeting.endTime),  // Convert time here
  //       duration: timeDiff,
  //       organizerName: meeting.User?.fullname,
  //       status: meeting.status,
  //     };
  //   });
  //   setMeetings(meeting);
  // };

  // useEffect(() => {
  //   getAllMeeting();
  // }, []);

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

  const calculateTimeDifference = (params) => {
    const meeting = params.row;
    if (meeting.status === "cancelled" || meeting.status === "completed") {
      return <>
        <b>{meeting.status}</b>
      </>
    }

    const now = new Date();

    // Function to convert AM/PM time to 24-hour format
    const convertTo24HourFormat = (time) => {
      const [timePart, modifier] = time.split(' ');
      let [hours, minutes] = timePart.split(':');
      if (hours === '12') {
        hours = '00';
      }
      if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
      }
      return `${hours}:${minutes}`;
    };

    const startTime24 = convertTo24HourFormat(meeting.startTime);
    const endTime24 = convertTo24HourFormat(meeting.endTime);

    const startDateTime = new Date(`${meeting.meetingDate}T${startTime24}`);
    const endDateTime = new Date(`${meeting.meetingDate}T${endTime24}`);

    const formatTime = (minutes) => {
      if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0
          ? `${hours} hr ${remainingMinutes} min`
          : `${hours} hr`;
      }
      return `${minutes} min`;
    };

    if (now < startDateTime) {
      const minutesUntilStart = Math.round((startDateTime - now) / (1000 * 60));
      return `Starts in ${formatTime(minutesUntilStart)}.`;
    } else if (now >= startDateTime && now <= endDateTime) {
      const minutesRemaining = Math.round((endDateTime - now) / (1000 * 60));
      return `Meeting ongoing, ${formatTime(minutesRemaining)} remaining.`;
    } else {
      return "Meeting approval time expired";
    }
  }


  const columns = [
    {
      field: "subject",
      headerName: "Subject",
      width: 300,
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "roomName",
      headerName: "Room",
      width: 150,
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
      field: "organizerName",
      headerName: "Organizer",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "progress",
      headerName: "Time Remaining",
      width: 260,
      renderCell: (params) => calculateTimeDifference(params),
      headerClassName: "super-app-theme--header",
    },
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
          getRowId={(row) => row.id}
          loading={loading}
          hideFooterPagination // Hide pagination controls
          rowHeight={50}
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
