import React, { useEffect, useState, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, LinearProgress } from "@mui/material";
import "./TodaysMeetings.css";

import dayjs from "dayjs";
import durationPlugin from "dayjs/plugin/duration";
import axios from "axios";
import { getFormattedDate, timeDifference } from "../../utils/utils";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
dayjs.extend(durationPlugin);

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
  const progress = params.value;
  const color = getColorByProgress(progress);

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
            bgcolor: "#f0f0f0", // Light gray background for unused portion
            "& .MuiLinearProgress-bar": {
              bgcolor: color.bar, // Progress bar color
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
  { field: "roomName", headerName: "Room", width: 200 },
  { field: "roomLocation", headerName: "Location", width: 125 },
  
  { field: "startTime", headerName: "Start Time", width: 125 },
  { field: "endTime", headerName: "End Time", width: 125 },
  { field: "duration", headerName: "Duration", width: 100 },
  { field: "organizerName", headerName: "Organizer", width: 125 },
  {
    field: "progress",
    headerName: "Time Remaining",
    width: 400,
    renderCell: renderProgressBar,
  },
];

const TodaysMeetings = () => {
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
      const todayDate=getFormattedDate()
      setTodayDate(todayDate);
      setRoom(response.data.data.meeting.filter((meet)=>meet.meetingDate===todayDate));
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
    }
  };

  useEffect(() => {
      fetchData();
    }, [refreshPage]);

    setTimeout(()=>{
      setRefreshPage(Math.random())
    },10000)

  const generateFakeMeetings = () => {
    const meetings = [];
    const baseStartTime = "09:00:00";
    const meetingDate = todayDate;


    room?.map((meeting)=>{

    let startTime = dayjs(`${meetingDate}T${meeting.startTime}`);
      const endTime = dayjs(`${meetingDate}T${meeting.endTime}`);
      const timeDiff = timeDifference(meeting?.startTime,meeting?.endTime)

      meetings.push({
        meetingId: meeting.id,
        subject: meeting.subject,
        agenda: meeting.agenda,
        private: meeting.isPrivate,
        notes: meeting.notes,
        meetingDate: meetingDate,
        startTime: startTime.format("HH:mm:ss"),
        endTime: endTime.format("HH:mm:ss"),
        duration: timeDiff,
        roomName: meeting.Room.name,
        roomLocation: meeting.Room.Location.locationName,
        organizerName: meeting.User.fullname,
        progress: Math.floor(Math.random() * 101),
      });

      startTime = endTime.add(15, "minute");
    })
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

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        bgcolor: "white",
        display: "flex",
        flexDirection: "column",
      }}
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
        getRowClassName={(params) => {
          const color = getColorByProgress(params.row.progress);
          return `progress-row-${color.row.replace("#", "")}`;
        }}
        sx={{
          flexGrow: 1,
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#3182ce",
            color: "black",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-row": {
            borderBottom: "1px solid #d9d9d9",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          },
          "& .MuiDataGrid-columnHeaderRow": {
            borderBottom: "2px solid #3182ce",
          },
        }}
      />
    </Box>
  );
};

export default TodaysMeetings;
