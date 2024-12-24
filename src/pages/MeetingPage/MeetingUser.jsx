import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Grid2,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";

const MeetingFormPage = ({ rooms, users, onSubmit }) => {
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      roomId: "",
      organizerId: "",
      participants: [],
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string(),
      startTime: Yup.date().required("Start time is required"),
      endTime: Yup.date()
        .required("End time is required")
        .min(Yup.ref("startTime"), "End time should be after start time"),
      roomId: Yup.string().required("Room is required"),
      organizerId: Yup.string().required("Organizer is required"),
      participants: Yup.array(),
    }),
    onSubmit: (values) => {
      values.participants = selectedParticipants;
      onSubmit(values);
    },
  });

  const handleParticipantChange = (event) => {
    const { value } = event.target;
    setSelectedParticipants(
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        my: 4,
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" component="h1" className="mb-4 text-center">
        Schedule Meeting
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid2 container spacing={2}>
          <Grid2 item xs={12}>
            <TextField
              label="Title"
              name="title"
              fullWidth
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Grid2>
          <Grid2 item xs={12}>
            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </Grid2>
          <Grid2 item xs={12} sm={6}>
            <TextField
              label="Start Time"
              name="startTime"
              type="datetime-local"
              fullWidth
              value={formik.values.startTime}
              onChange={formik.handleChange}
              error={
                formik.touched.startTime && Boolean(formik.errors.startTime)
              }
              helperText={formik.touched.startTime && formik.errors.startTime}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid2>
          <Grid2 item xs={12} sm={6}>
            <TextField
              label="End Time"
              name="endTime"
              type="datetime-local"
              fullWidth
              value={formik.values.endTime}
              onChange={formik.handleChange}
              error={formik.touched.endTime && Boolean(formik.errors.endTime)}
              helperText={formik.touched.endTime && formik.errors.endTime}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid2>
          <Grid2 item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Room</InputLabel>
              <Select
                name="roomId"
                value={formik.values.roomId}
                onChange={formik.handleChange}
                error={formik.touched.roomId && Boolean(formik.errors.roomId)}
              >
                {rooms.map((room) => (
                  <MenuItem key={room.roomId} value={room.roomId}>
                    {room.roomName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>
          <Grid2 item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Organizer</InputLabel>
              <Select
                name="organizerId"
                value={formik.values.organizerId}
                onChange={formik.handleChange}
                error={
                  formik.touched.organizerId &&
                  Boolean(formik.errors.organizerId)
                }
              >
                {users.map((user) => (
                  <MenuItem key={user.userId} value={user.userId}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>
          <Grid2 item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Participants</InputLabel>
              <Select
                multiple
                value={selectedParticipants}
                onChange={handleParticipantChange}
                renderValue={(selected) =>
                  selected
                    .map((id) => users.find((u) => u.userId === id)?.name)
                    .join(", ")
                }
              >
                {users.map((user) => (
                  <MenuItem key={user.userId} value={user.userId}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>
        </Grid2>
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            type="reset"
            color="secondary"
            className="me-2"
            onClick={formik.handleReset}
          >
            Clear
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Schedule Meeting
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MeetingFormPage;
