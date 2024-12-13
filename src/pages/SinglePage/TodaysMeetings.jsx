import React, { useEffect, useState, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, LinearProgress } from "@mui/material";
import "./TodaysMeetings.css";

import dayjs from "dayjs";
import durationPlugin from "dayjs/plugin/duration";
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
  { field: "roomName", headerName: "Room Name", width: 200 },
  { field: "roomLocation", headerName: "Room Location", width: 175 },
  { field: "title", headerName: "Title", width: 150 },
  { field: "startTime", headerName: "Start Time", width: 125 },
  { field: "endTime", headerName: "End Time", width: 125 },
  { field: "duration", headerName: "Duration", width: 150 },
  { field: "organizerName", headerName: "Organizer", width: 175 },
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
  const gridRef = useRef(null);

  const generateFakeMeetings = () => {
    const meetings = [];
    const baseStartTime = "09:00:00";
    const meetingDate = "2024-11-29";

    let startTime = dayjs(`${meetingDate}T${baseStartTime}`);

    for (let i = 1; i <= 50; i++) {
      const meetingLength = Math.floor(Math.random() * 120) + 30;
      const endTime = startTime.add(meetingLength, "minute");

      const duration = dayjs.duration(meetingLength, "minute");
      const formattedDuration = `${duration.hours()}h ${duration.minutes()}m`;

      meetings.push({
        meetingId: i,
        title: `Meeting ${i}`,
        meetingDate: meetingDate,
        startTime: startTime.format("HH:mm:ss"),
        endTime: endTime.format("HH:mm:ss"),
        duration: formattedDuration,
        roomName: `Room ${Math.ceil(i / 4)}`,
        roomLocation: `Building ${(i % 3) + 1}`,
        organizerName: `Organizer ${i}`,
        progress: Math.floor(Math.random() * 101),
      });

      startTime = endTime.add(15, "minute");
    }
    return meetings;
  };

  useEffect(() => {
    setMeetings(generateFakeMeetings());
    setLoading(false);
  }, []);

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
