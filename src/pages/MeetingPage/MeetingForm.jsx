import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Autocomplete,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { disablePastDates, fetchActiveCommittee, fetchUsers } from "../../utils/utils";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";

const MeetingForm = ({ room }) => {
  const [emailsList, setEmailsList] = useState([]);
  const [committeeList, setCommitteeList] = useState([]);
  const [startTime, setStartTime] = useState(""); // Example start time
  const [endTime, setEndTime] = useState(""); // Example end time
  const [difference, setDifference] = useState("0h 0m");

  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    fetchActiveCommittee(toast, setCommitteeList);
    fetchUsers(toast, setEmailsList);
  }, []);
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      roomId: room.id,
      organizerId: user.id,
      subject: "",
      agenda: "",
      guestUser: "",
      startTime: null,
      endTime: null,
      date: null,
      attendees: [],
      committees: [],
      notes: "",
      additionalEquipment: "",
      isPrivate: false,
    },
    validationSchema: Yup.object({
      subject: Yup.string().required("Meeting Title is required"),
      agenda: Yup.string().required("Agenda is required"),
      startTime: Yup.date().required("Start Time is required"),
      endTime: Yup.date()
        .required("End Time is required")
        .min(Yup.ref("startTime"), "End Time must be after Start Time"),
      date: Yup.date().required("Meeting Date is required"),
      attendees: Yup.array().optional(),
      committees: Yup.array().min(1, "At least one committee must be selected"),
      notes: Yup.string(),
      guestUser: Yup.string(),
      additionalEquipment: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      console.log("Form Submitted:", values);

      try {
        dispatch(showLoading());
        const payload = {
          ...values,
          attendees: values.attendees.map((attendee) => attendee.id),
          committees: values.committees.map((committee) => committee.id),
        };
        console.log("payload", payload);
        const response = await axios.post(
          "/api/v1/meeting/add-meeting",
          payload,
          {
            withCredentials: true,
          }
        );

        toast.success("Meeting added successfully");
        resetForm();
        dispatch(hideLoading());
      } catch (error) {
        dispatch(hideLoading());
        toast.error(error.response?.data?.message || "An error occurred");
        console.error("Error adding meeting:", error);
      }
    },
  });

  const calculateDifference = () => {
    // Parse times into Date objects (using today's date)
    const today = new Date()?.toISOString()?.split("T")[0]; // Get today's date in YYYY-MM-DD
    const start = new Date(`${today}T${startTime}`);
    const end = new Date(`${today}T${endTime}`);

    // Calculate the difference in milliseconds
    const diffMs = end - start;

    // Convert milliseconds to hours, minutes, and seconds
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    if (formik.values.startTime && formik.values.endTime)
      setDifference(`${hours}h ${minutes}m`);
  };

  useEffect(() => {
    setStartTime(
      new Date(formik.values.startTime)?.toTimeString()?.split(" ")[0]
    );
    setEndTime(new Date(formik.values.endTime)?.toTimeString()?.split(" ")[0]);
    calculateDifference();
  }, [formik]);

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      {/* Date */}
      <Box display="flex" justifyContent="space-between" gap={1}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Date"
          value={formik.values.date}
          onChange={(value) => formik.setFieldValue("date", value)}
          shouldDisableDate={disablePastDates}
          renderInput={(params) => (
            <TextField
              {...params}
              margin="normal"
              fullWidth
              error={formik.touched.date && Boolean(formik.errors.date)}
              helperText={formik.touched.date && formik.errors.date}
              size="small"
            />
          )}
        />
        </LocalizationProvider>

        {/* Start Time & End Time */}
        <Box display="flex" justifyContent="space-around" gap={1}>
          <TimePicker
            label="Start Time"
            value={formik.values.startTime}
            onChange={(value) => formik.setFieldValue("startTime", value)}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                size="small"
                style={{ marginRight: 8, flex: 1 }}
                error={
                  formik.touched.startTime && Boolean(formik.errors.startTime)
                }
                helperText={formik.touched.startTime && formik.errors.startTime}
              />
            )}
          />

          <TimePicker
            label="End Time"
            value={formik.values.endTime}
            onChange={(value) => formik.setFieldValue("endTime", value)}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                size="small"
                style={{ flex: 1 }}
                error={formik.touched.endTime && Boolean(formik.errors.endTime)}
                helperText={formik.touched.endTime && formik.errors.endTime}
              />
            )}
          />
        </Box>
        <Box
          justifyContent="space-around"
          gap={1}
          sx={{
            background: "#fd7e14",
            color: "#fff",
            padding: "5px",
            borderRadius: 1,
          }}
        >
          <Typography variant="subtitle2" component="p">
            Duration
          </Typography>
          <Typography variant="body2" component="p">
            {difference}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between">
        {/* Meeting Title */}
        <TextField
          label="Subject"
          name="subject"
          margin="normal"
          fullWidth
          value={formik.values.subject}
          onChange={formik.handleChange}
          error={formik.touched.subject && Boolean(formik.errors.subject)}
          helperText={formik.touched.subject && formik.errors.subject}
          size="small"
          required
          style={{ marginRight: 8 }}
        />
        {/* Agenda */}
        <TextField
          label="Agenda"
          name="agenda"
          margin="normal"
          fullWidth
          value={formik.values.agenda}
          onChange={formik.handleChange}
          error={formik.touched.agenda && Boolean(formik.errors.agenda)}
          helperText={formik.touched.agenda && formik.errors.agenda}
          required
          size="small"
        />
      </Box>
      <Box display="flex" gap={1} justifyContent="space-between">
        <Autocomplete
          multiple
          id="attendees"
          name="attendees"
          size="small"
          sx={{
            width: "100%",
          }}
          options={emailsList}
          value={formik.values.attendees}
          onChange={(_, newValue) =>
            formik.setFieldValue("attendees", newValue)
          }
          getOptionLabel={(option) => option.name}
          renderOption={(props, option) => (
            <Box
              component="li"
              {...props}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div>
                {/* Render the attendee's name */}
                <span>{option.name}</span>
              </div>
              <div sx={{ width: "100%", float: "right" }}>
                {/* Render a hardcoded Chip for availability */}
                <Chip
                  label={
                    option.id === "15b8126b-8ce7-443c-a231-007179da901a"
                      ? "Unavailable"
                      : "Available"
                  }
                  color={
                    option.id === "15b8126b-8ce7-443c-a231-007179da901a"
                      ? "error"
                      : "success"
                  }
                  size="small"
                />
              </div>
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Attendees"
              error={
                formik.touched.attendees && Boolean(formik.errors.attendees)
              }
              helperText={formik.touched.attendees && formik.errors.attendees}
            />
          )}
          disableCloseOnSelect
          isOptionEqualToValue={(option, value) => option.id === value.id}
        />
        <Autocomplete
          multiple
          id="committees"
          name="committees"
          size="small"
          sx={{
            width: "100%", // Adjust the width as needed
          }}
          options={committeeList}
          value={formik.values.committees}
          onChange={(_, newValue) =>
            formik.setFieldValue("committees", newValue)
          }
          getOptionLabel={(option) => option.name}
          renderOption={(props, option) => (
            <Box
              component="li"
              {...props}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div>
                {/* Render the attendee's name */}
                <span>{option.name}</span>
              </div>
              <div sx={{ width: "100%", float: "right" }}>
                {/* Render a hardcoded Chip for availability */}
                <Chip
                  label={
                    option.id === "15b8126b-8ce7-443c-a231-007179da901a"
                      ? "Unavailable"
                      : "Available"
                  }
                  color={
                    option.id === "15b8126b-8ce7-443c-a231-007179da901a"
                      ? "error"
                      : "success"
                  }
                  size="small"
                />
              </div>
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Committee"
              error={
                formik.touched.committees && Boolean(formik.errors.committees)
              }
              helperText={formik.touched.committees && formik.errors.committees}
            />
          )}
          disableCloseOnSelect
          isOptionEqualToValue={(option, value) => option.id === value.id}
        />
      </Box>
      <Box display="flex" gap={1} justifyContent="space-between">
        {/* Description */}
        <TextField
          label="Notes"
          name="notes"
          margin="normal"
          fullWidth
          multiline
          rows={3}
          value={formik.values.notes}
          onChange={formik.handleChange}
          error={formik.touched.notes && Boolean(formik.errors.notes)}
          helperText={formik.touched.notes && formik.errors.notes}
          size="small"
        />

        {/* Description */}
        <TextField
          label="Additional Equipment Needed"
          name="additionalEquipment"
          margin="normal"
          fullWidth
          multiline
          rows={3}
          value={formik.values.additionalEquipment}
          onChange={formik.handleChange}
          error={
            formik.touched.additionalEquipment &&
            Boolean(formik.errors.additionalEquipment)
          }
          helperText={
            formik.touched.additionalEquipment &&
            formik.errors.additionalEquipment
          }
          size="small"
        />
      </Box>
      {/* Private Meeting */}
      <Box display="flex" gap={1} justifyContent="space-between">
        <Box component="p">
          <Typography variant="subtitle1" component="p" sx={{ mt: 2 }}>
            Is this a private meeting?
          </Typography>
          <RadioGroup
            name="isPrivate"
            value={formik.values.isPrivate}
            onChange={(e) =>
              formik.setFieldValue("isPrivate", e.target.value === "true")
            }
            row
          >
            <FormControlLabel value={true} control={<Radio />} label="Yes" />
            <FormControlLabel value={false} control={<Radio />} label="No" />
          </RadioGroup>
        </Box>
        <Box component="p">
          <Typography variant="subtitle1" component="p" sx={{ mt: 2 }}>
            Guest user(Comma separate email Id)
          </Typography>
          <TextField
            label="guestUser"
            name="guestUser"
            margin="normal"
            fullWidth
            sx={{ width: "100%" }}
            value={formik.values.guestUser}
            onChange={formik.handleChange}
            error={formik.touched.guestUser && Boolean(formik.errors.guestUser)}
            helperText={formik.touched.guestUser && formik.errors.guestUser}
            size="small"
          />
        </Box>
      </Box>

      {/* Submit Button */}
      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button type="submit" variant="contained" color="primary">
          Add Meeting
        </Button>
      </Box>
    </Box>
  );
};

export default MeetingForm;
