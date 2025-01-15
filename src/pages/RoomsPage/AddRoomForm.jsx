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
import axios from "axios";
import toast from "react-hot-toast";
import { PhotoCameraIcon } from "../../components/Common/CustomButton/CustomIcon";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";

const AddRoomForm = ({ setDeleteUpdateStatus, setIsAddOpen }) => {
  const [roomImagePreview, setRoomImagePreview] = useState(null);
  const [locationList, setLocationList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [roomImageError, setRoomImageError] = useState("");
  const [formState, setFormState] = useState({
    sanitationStatus: false,
    isAvailable: true,
  });

  const validateImage = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 2 * 1024 * 1024;
    if (!allowedTypes.includes(file.type)) {
      return "Only JPEG, PNG, GIF, and WEBP images are allowed.";
    }
    if (file.size > maxSize) {
      return "Image must be smaller than 2MB.";
    }

    return null;
  };
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        dispatch(showLoading());

        // This is for location section
        const response = await axios.get("api/v1/location/activeLocations");
        const locations = response.data.data.result.map((location) => {
          return { id: location.id, location: location.locationName };
        });

        // This is for services section
        const responseServices = await axios.get("api/v1/services/active");
        const services = responseServices.data.data.result.map((service) => {
          return { id: service.id, services: service.servicesName };
        });
        setServicesList(services)
        setLocationList(locations);
        dispatch(hideLoading());
      } catch (error) {
        dispatch(hideLoading());
        toast.error("Failed to load location");
        console.error("Error fetching location:", error);
      }
    };

    fetchLocation();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      location: null,
      services:null,
      capacity: "",
      tolerancePeriod: "",
      sanitationPeriod: "",
      roomImage: "",
      description: "",
      sanitationStatus: false,
      isAvailable: true,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Room Name is required"),
      location: Yup.object({
        id: Yup.string().required("Id is required"),
        location: Yup.string().required("location is required"),
      }),
      services: Yup.object({
        id: Yup.string().required("Id is required"),
        services: Yup.string().required("services is required"),
      }),
      capacity: Yup.number()
        .required("Capacity is required")
        .positive()
        .integer(),
      tolerancePeriod: Yup.number()
        .required("Tolerance Period is required")
        .positive()
        .integer(),
      sanitationPeriod: Yup.number()
        .required("Tolerance Period is required")
        .positive()
        .integer(),
      description: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        dispatch(showLoading());
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("capacity", values.capacity);
        formData.append("tolerancePeriod", values.tolerancePeriod);
        formData.append("sanitationPeriod", values.sanitationPeriod);
        formData.append("description", values.description);
        formData.append("location", values.location.id);
        formData.append("services", values.services.id);
        formData.append("sanitationStatus", formState.sanitationStatus);
        formData.append("isAvailable", formState.isAvailable);
        if (values.roomImage) formData.append("roomImage", values.roomImage);

        const response = await axios.post("api/v1/rooms/add-room", formData, {
          withCredentials: true,
        });

        toast.success("Room added successfully");
        resetForm();
        setRoomImagePreview(null);
        setDeleteUpdateStatus(Math.random());
        setIsAddOpen(false);
        setRoomImageError("");
        dispatch(hideLoading());
      } catch (error) {
        dispatch(hideLoading());
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
    const { name, checked } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: checked, // Update state based on Switch value
    }));
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
          id="services"
          name="services"
          style={{ marginTop: 15, flex: 1 }}
          size="small"
          margin="normal"
          options={servicesList}
          getOptionLabel={(servicesList) => servicesList.services}
          value={formik.values.services}
          onChange={(_, newValue) => formik.setFieldValue("services", newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Services"
              error={formik.touched.services && Boolean(formik.errors.services)}
              helperText={formik.touched.services && formik.errors.services}
            />
          )}
        />
      </Box>
      <Box display="flex" justifyContent="space-between">
        <TextField
          label="Sanitation Period (in min.)"
          name="sanitationPeriod"
          margin="normal"
          type="number"
          slotProps={{
            inputProps: { min: 15},
          }}
          // value={formik.values.Sanitation Time}
          onChange={formik.handleChange}
          // error={formik.touched.Sanitation Time && Boolean(formik.errors.Sanitation Time)}
          // helperText={formik.touched.Sanitation Time && formik.errors.Sanitation Time}
          size="small"
          style={{ marginRight: 8, flex: 1 }}
        />
        <Autocomplete
          id="location"
          name="location"
          style={{ marginTop: 15, flex: 1 }}
          size="small"
          margin="normal"
          options={locationList}
          getOptionLabel={(locationList) => locationList.location}
          value={formik.values.location}
          onChange={(_, newValue) => formik.setFieldValue("location", newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Location"
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
            />
          )}
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
          label="Tolerance Period  (in min.)"
          name="tolerancePeriod"
          margin="normal"
          type="number"
          // value={formik.values.Sanitation Time}
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
              checked={formState.sanitationStatus}
              name="sanitationStatus"
              size="small"
              onChange={handleSanitationStatusChange}
            />
          }
          label="Sanitation status"
        />

        <FormControlLabel
          control={
            <Switch
              checked={formState.isAvailable}
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

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        mt={2}
        mb={2}
      >
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="room-image-upload"
          type="file"
          onChange={handleRoomImageChange}
        />
        <label htmlFor="room-image-upload">
          <IconButton component="span">
            <Avatar
              sx={{ width: 50, height: 50 }}
              src={roomImagePreview}
              alt="Room Image Preview"
            >
              <PhotoCameraIcon fontSize="medium" />
            </Avatar>
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
          Add Room
        </Button>
      </Box>
    </Box>
  );
};

export default AddRoomForm;
