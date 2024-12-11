import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Avatar,
  IconButton,
  Paper,
  styled,
  Autocomplete,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import axios from "axios";
import toast from "react-hot-toast";

const EditRoomForm = ({ room }) => {
  const [roomImagePreview, setRoomImagePreview] = useState(null);
  const [locationList, setLocationList] = useState([]);
  const [roomImageError, setRoomImageError] = useState("");
  const [sanitationStatus, setSanitationStatus] = useState(
    room.sanitationStatus
  );
  const [isAvailable, setIsAvailable] = useState(room.isAvailable);
  const validateImage = (file) => {
    // Allowed image types
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    // Max file size (2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return "Only JPEG, PNG, GIF, and WEBP images are allowed.";
    }

    // Check file size
    if (file.size > maxSize) {
      return "Image must be smaller than 2MB.";
    }

    return null;
  };

  // Fetching the  list
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get("api/v1/location/activeLocations");
        const locations = response.data.data.result.map((location) => {
          return { id: location.id, label: location.locationName };
        });
        setLocationList(locations);
      } catch (error) {
        toast.error("Failed to load location");
        console.error("Error fetching location:", error);
      }
    };

    setRoomImagePreview(
      `${import.meta.env.VITE_API_URL}/${room.roomImagePath}`
    );

    fetchLocation();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: room.name,
      location: { id: room.Location.id, label: room.Location.locationName },
      capacity: room.capacity,
      tolerancePeriod: room.tolerancePeriod,
      roomImage: room.roomImage,
      description: room.description,
      sanitationStatus: sanitationStatus,
      isAvailable: isAvailable,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Room Name is required"),
      location: Yup.object({
        id: Yup.string().required("Id is required"),
        label: Yup.string().required("label is required"),
      }),
      capacity: Yup.number()
        .required("Capacity is required")
        .positive()
        .integer(),
      tolerancePeriod: Yup.number()
        .required("Tolerance Period is required")
        .positive()
        .integer(),
      // password: Yup.string().required("Password is required"),
      description: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      console.log("Form Submitted:", values);
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("capacity", values.capacity);
        formData.append("tolerancePeriod", values.tolerancePeriod);
        formData.append("description", values.description);
        formData.append("location", values.location.id);
        formData.append("sanitationStatus", sanitationStatus);
        formData.append("isAvailable", isAvailable);
        if (values.roomImage) formData.append("roomImage", values.roomImage);

        const response = await axios.put(
          `api/v1/rooms/edit-room/${room.id}`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json", // Explicitly set content type
            },
          }
        );

        toast.success("Room updated successfully");
        resetForm();
        setRoomImagePreview(null);

        setRoomImageError("");
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
        console.error("Error adding room:", error);
      }
    },
  });

  const handleRoomImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      // Reset previous error
      setRoomImageError("");

      // Validate image
      const validationError = validateImage(file);

      if (validationError) {
        // Set error and clear image
        setRoomImageError(validationError);
        setRoomImagePreview(null);
        formik.setFieldValue("roomImage", "");
        return;
      }

      // If validation passes
      formik.setFieldValue("roomImage", file);
      setRoomImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle change for the Switch
  const handleSanitationStatusChange = (event) => {
    formik.setFieldValue("sanitationStatus", event.target.checked);
    setSanitationStatus(event.target.checked);
  };

  // Handle change for the Switch
  const handleIsAvailableChange = (event) => {
    formik.setFieldValue("isAvailable", event.target.checked);
    setIsAvailable(event.target.checked);
  };
  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Box display="flex" justifyContent="space-between">
        <TextField
          label="Room Name"
          name="name"
          margin="normal"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          style={{ marginRight: 8, flex: 1 }}
          size="small"
        />
        <Autocomplete
          id="location"
          name="location"
          style={{ marginTop: 15, flex: 1 }}
          size="small"
          margin="normal"
          options={locationList}
          getOptionLabel={(locationList) => locationList.label}
          value={formik.values.location}
          onChange={(_, newValue) => formik.setFieldValue("location", newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Location"
              error={
                formik.touched.location?.id && Boolean(formik.errors.location)
              }
              helperText={formik.touched.location?.id && formik.errors.location}
            />
          )}
          disableCloseOnSelect
        />
      </Box>
      <Box display="flex" justifyContent="space-between">
        <TextField
          label="Capacity"
          name="capacity"
          margin="normal"
          type="number"
          value={formik.values.capacity}
          onChange={formik.handleChange}
          error={formik.touched.capacity && Boolean(formik.errors.capacity)}
          helperText={formik.touched.capacity && formik.errors.capacity}
          size="small"
          style={{ marginRight: 8, flex: 1 }}
        />
        <TextField
          label="Tolerance Period"
          name="tolerancePeriod"
          margin="normal"
          type="number"
          value={formik.values.tolerancePeriod}
          onChange={formik.handleChange}
          // error={formik.touched.Sanitation Time && Boolean(formik.errors.Sanitation Time)}
          // helperText={formik.touched.Sanitation Time && formik.errors.Sanitation Time}
          size="small"
          style={{ marginRight: 8, flex: 1 }}
        />
      </Box>
      <Box display="flex" justifyContent="space-between">
        <FormControlLabel
          control={
            <Switch
              checked={sanitationStatus}
              name="sanitationStatus"
              onChange={(event) => handleSanitationStatusChange(event)}
            />
          }
          label="Sanitation status"
        />
        <FormControlLabel
          control={
            <Switch
              checked={isAvailable}
              name="isAvailable"
              onChange={(event) => handleIsAvailableChange(event)}
            />
          }
          label="Is Available"
        />
      </Box>
      <TextField
        label="Description"
        name="description"
        margin="normal"
        value={formik.values.description}
        onChange={formik.handleChange}
        error={formik.touched.description && Boolean(formik.errors.description)}
        helperText={formik.touched.description && formik.errors.description}
        size="small"
        // style={{ flex: 1 }}
        multiline
        rows={3}
        fullWidth
        style={{ marginBottom: 16 }}
      />

      {/* AVatar */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-around"
        mt={2}
        mb={2}
      >
        <Avatar
          sx={{ width: 75, height: 75 }}
          src={roomImagePreview}
          alt="Room Image Preview"
        />
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="room-image-upload"
          type="file"
        />
        <label htmlFor="room-image-upload">
          <IconButton component="span" color="primary">
            <PhotoCameraIcon
              fontSize="medium"
              onChange={handleRoomImageChange}
            />
          </IconButton>
        </label>
      </Box>

      {roomImageError && (
        <Typography
          color="error"
          variant="body2"
          align="center"
          style={{ marginBottom: 16 }}
        >
          {roomImageError}
        </Typography>
      )}
      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default EditRoomForm;
