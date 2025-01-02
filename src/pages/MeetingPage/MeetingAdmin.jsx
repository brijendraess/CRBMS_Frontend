import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  LinearProgress,
  Grid,
  Paper,
  styled,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";

const MeetingList = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  // textAlign: "center",
  color: theme.palette.text.secondary,
  height: "100%",
  width: "100%",
  lineHeight: "60px",
  borderRadius: "20px",
  padding: "15px",
  marginTop: "10px",
  // top: "75px",
}));

const MeetingAdmin = ({ isAdmin }) => {
  // Dummy data for meetings
  const dummyMeetings = [
    {
      id: 1,
      title: "Project Kickoff",
      description: "Initial meeting to discuss project scope",
      startTime: dayjs().subtract(1, "hour").format(),
      endTime: dayjs().add(1, "hour").format(),
    },
    {
      id: 2,
      title: "Design Review",
      description: "Review design mockups with team",
      startTime: dayjs().add(1, "day").startOf("day").format(),
      endTime: dayjs().add(1, "day").endOf("day").format(),
    },
    {
      id: 3,
      title: "Retrospective",
      description: "Sprint retrospective meeting",
      startTime: dayjs().subtract(3, "days").format(),
      endTime: dayjs().subtract(2, "days").format(),
    },
    // More dummy data
  ];

  const [filter, setFilter] = useState("all");

  // Filtered meetings based on filter state
  const filteredMeetings = dummyMeetings.filter((meeting) => {
    const now = dayjs();
    const start = dayjs(meeting.startTime);
    const end = dayjs(meeting.endTime);

    switch (filter) {
      case "start":
        return start.isBefore(now) && end.isAfter(now);
      case "completed":
        return end.isBefore(now);
      case "today":
        return start.isSame(now, "day");
      case "tomorrow":
        return start.isSame(now.add(1, "day"), "day");
      default:
        return true;
    }
  });

  // Calculate completion percentage for the progress bar
  const getProgress = (start, end) => {
    const now = dayjs();
    const totalDuration = dayjs(end).diff(dayjs(start), "minute");
    const elapsed = now.isAfter(start) ? now.diff(dayjs(start), "minute") : 0;
    return Math.min((elapsed / totalDuration) * 100, 100);
  };

  // Columns for DataGrid
  const columns = [
    { field: "title", headerName: "Title", width: 200 },
    { field: "description", headerName: "Description", width: 300 },
    {
      field: "startTime",
      headerName: "Start Time",
      width: 180,
      valueFormatter: ({ value }) => dayjs(value).format("YYYY-MM-DD HH:mm"),
    },
    {
      field: "endTime",
      headerName: "End Time",
      width: 180,
      valueFormatter: ({ value }) => dayjs(value).format("YYYY-MM-DD HH:mm"),
    },
    {
      field: "progress",
      headerName: "Progress",
      width: 150,
      renderCell: (params) => (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <LinearProgress
            variant="determinate"
            value={getProgress(params.row.start, params.row.end)}
            sx={{
              width: "80%", // Adjust width as needed
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#4caf50", // Custom color for the filled portion
              },
              backgroundColor: "#e0e0e0", // Custom color for the empty portion
              height: 8, // Adjust height if desired
              borderRadius: 5, // Optional: rounded corners
            }}
          />
        </Box>
      ),
    },
  ];

  return (
    <>
      <div className="row w-100">
        <div className="roomHeader col-xl-12 w-100">
          <Typography variant="h6" gutterBottom marginRight="auto">
            Meeting Management
          </Typography>
          {/* {isAdmin ? (
            <Typography variant="h6" gutterBottom marginRight="auto">
              Meeting Management
            </Typography>
          ) : (
            <Box
              display="flex"
              justifyContent="space-between"
              width="100%"
              alignItems="center"
            >
              <Typography variant="h6">Meeting Management</Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  mr: "20px",
                }}
              >
                <Typography variant="h6">Filter By:</Typography>
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  displayEmpty
                  size="small"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="start">Start</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="tomorrow">Tomorrow</MenuItem>
                </Select>
              </Box>
            </Box>
          )} */}
        </div>
      </div>
      <MeetingList>
        <div style={{ height: 500, width: "100%", marginTop: "10px" }}>
          <DataGrid
            rows={filteredMeetings}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            disableSelectionOnClick
            sx={{
              "& .MuiDataGrid-cell:focus": {
                outline: "none", // Removes the focus border
              },
            }}
          />
        </div>
      </MeetingList>
    </>
  );
};

export default MeetingAdmin;
