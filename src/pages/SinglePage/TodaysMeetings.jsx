import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, LinearProgress } from "@mui/material";
import dayjs from "dayjs";
import durationPlugin from "dayjs/plugin/duration"; // For handling durations
dayjs.extend(durationPlugin);

const TodaysMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const generateFakeMeetings = () => {
    const meetings = [];
    const baseStartTime = "09:00:00"; // First meeting starts at 9:00 AM
    const meetingDate = "2024-11-29"; // Example date

    let startTime = dayjs(`${meetingDate}T${baseStartTime}`);

    for (let i = 1; i <= 20; i++) {
      const meetingLength = Math.floor(Math.random() * 120) + 30; // Random duration (30 to 150 minutes)
      const endTime = startTime.add(meetingLength, "minute"); // Calculate end time

      // Calculate duration
      const duration = dayjs.duration(meetingLength, "minute");
      const formattedDuration = `${duration.hours()}h ${duration.minutes()}m`; // Format as "Xh Ym"

      meetings.push({
        meetingId: i,
        title: `Meeting ${i}`,
        meetingDate: meetingDate,
        startTime: startTime.format("HH:mm:ss"),
        endTime: endTime.format("HH:mm:ss"),
        duration: formattedDuration, // Add duration
        roomName: `Room ${Math.ceil(i / 4)}`, // Group into rooms
        roomLocation: `Building ${(i % 3) + 1}`,
        organizerName: `Organizer ${i}`,
        progress: Math.floor(Math.random() * 101), // Random progress (0-100)
      });

      startTime = endTime.add(15, "minute"); // Add 15-minute gap for the next meeting
    }

    return meetings;
  };

  useEffect(() => {
    const fetchFakeMeetings = () => {
      const fakeData = generateFakeMeetings();
      setMeetings(fakeData);
      setLoading(false);
    };

    fetchFakeMeetings();
  }, []);

  const renderProgressBar = (params) => {
    const progress = params.value;

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
              borderRadius: 5, // Rounded edges
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

  const columns = [
    { field: "title", headerName: "Title", width: 150 },
    { field: "startTime", headerName: "Start Time", width: 125 },
    { field: "endTime", headerName: "End Time", width: 125 },
    { field: "duration", headerName: "Duration", width: 150 },
    { field: "roomName", headerName: "Room Name", width: 200 },
    { field: "roomLocation", headerName: "Room Location", width: 175 },
    { field: "organizerName", headerName: "Organizer", width: 175 },
    {
      field: "progress",
      headerName: "Time Remaining",
      width: 250,
      renderCell: renderProgressBar,
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={meetings}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 15]}
        disableSelectionOnClick
        getRowId={(row) => row.meetingId}
        loading={loading}
      />
    </Box>
  );
};

export default TodaysMeetings;
