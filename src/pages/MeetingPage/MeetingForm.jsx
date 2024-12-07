import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Autocomplete,
  RadioGroup,
  FormControlLabel,
  Radio,
  styled,
  Paper,
  Chip,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const FormWrapper = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  height: "100%",
  width: "100%",
  lineHeight: "60px",
  borderRadius: "20px",
  padding: "15px",
  marginTop: "10px",
}));

const MeetingForm = () => {
  const [emailsList, setEmailsList] = useState([]);
  const { id } = useParams(); // Room id
  console.log(id);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/v1/user/users");
        const emails = response.data.data.users.rows.map((user) => ({
          email: user.email,
          id: user.id,
          name: user.fullname,
        }));
        setEmailsList(emails);
        // console.log(response.data.data.users.rows);
      } catch (error) {
        toast.error("Failed to load users");
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const formik = useFormik({
    initialValues: {
      roomId: id,
      title: "",
      agenda: "",
      startTime: null,
      endTime: null,
      date: null,
      attendees: [],
      description: "",
      isPrivate: false,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Meeting Title is required"),
      agenda: Yup.string().required("Agenda is required"),
      startTime: Yup.date().required("Start Time is required"),
      endTime: Yup.date()
        .required("End Time is required")
        .min(Yup.ref("startTime"), "End Time must be after Start Time"),
      date: Yup.date().required("Meeting Date is required"),
      attendees: Yup.array().min(1, "At least one attendee must be selected"),
      description: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      console.log("Form Submitted:", values);

      try {
        const payload = {
          ...values,
          attendees: values.attendees.map((attendee) => attendee.id), // Only send user IDs
        };

        const response = await axios.post(
          "/api/v1/meeting/add-meeting",
          payload,
          {
            withCredentials: true,
          }
        );

        toast.success("Meeting added successfully");
        resetForm();
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
        console.error("Error adding meeting:", error);
      }
    },
  });

  return (
    <div className="pop-content w-100">
      <FormWrapper>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Box display="flex" justifyContent="space-between">
            {/* Meeting Title */}
            <TextField
              label="Meeting Title"
              name="title"
              margin="normal"
              fullWidth
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              size="small"
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
              size="small"
            />
          </Box>
          {/* Date */}
          <Box
            display="flex"
            justifyContent="space-between"
            marginTop={1}
            marginBottom={3}
            gap={5}
          >
            <DatePicker
              label="Meeting Date"
              value={formik.values.date}
              onChange={(value) => formik.setFieldValue("date", value)}
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
                      formik.touched.startTime &&
                      Boolean(formik.errors.startTime)
                    }
                    helperText={
                      formik.touched.startTime && formik.errors.startTime
                    }
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
                    error={
                      formik.touched.endTime && Boolean(formik.errors.endTime)
                    }
                    helperText={formik.touched.endTime && formik.errors.endTime}
                  />
                )}
              />
            </Box>
          </Box>

          {/* Attendees */}
          <Autocomplete
            multiple
            id="attendees"
            name="attendees"
            size="small"
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
                <div>
                {/* Render a hardcoded Chip for availability */}
                {option.id === "15b8126b-8ce7-443c-a231-007179da901a" ? ( // Example: Render based on id for hardcoded logic
                  <Chip label="Unavailable" color="error" size="small" />
                ) : (
                  <Chip label="Available" color="success" size="small" />
                )}
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

          {/* Description */}
          <TextField
            label="Description"
            name="description"
            margin="normal"
            fullWidth
            multiline
            rows={3}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
            size="small"
          />

          {/* Private Meeting */}
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

          {/* Submit Button */}
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button type="submit" variant="contained" color="primary">
              Add Meeting
            </Button>
          </Box>
        </Box>
      </FormWrapper>
    </div>
  );
};

export default MeetingForm;
