import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  IconButton,
  Autocomplete,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

import axios from "axios";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { useDispatch } from "react-redux";
import { PhotoCameraIcon } from "../Common/Buttons/CustomIcon";
import { validateImage } from "../../utils/utils";
import { PopContent } from "../../Style";
import FormButton from "../Common/Buttons/FormButton/FormButton";

const EditRoomForm = ({ room, setRefreshPage, setIsEditOpen }) => {
  const [roomImagePreview, setRoomImagePreview] = useState(null);
  const [locationList, setLocationList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [roomImageError, setRoomImageError] = useState("");
  const [sanitationStatus, setSanitationStatus] = useState(
    room.sanitationStatus
  );

  const dispatch = useDispatch();
  const [isAvailable, setIsAvailable] = useState(room.isAvailable);

  // Fetching the  list
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get("api/v1/location/activeLocations");
        const locations = response.data.data.result.map((location) => {
          return { id: location.id, label: location.locationName };
        });

        // This is for services section
        const responseServices = await axios.get("api/v1/services/active");
        const services = responseServices.data.data.result.map((service) => {
          return { id: service.id, label: service.servicesName };
        });
        setServicesList(services);
        setLocationList(locations);
        dispatch(hideLoading());
      } catch (error) {
        // toast.error("Failed to load location");
        console.error("Error fetching location:", error);
        dispatch(hideLoading());
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
      services: { id: room.Service.id, label: room.Service.servicesName },
      capacity: room.capacity,
      tolerancePeriod: room.tolerancePeriod,
      sanitationPeriod: room.sanitationPeriod,
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
      services: Yup.object({
        id: Yup.string().required("Id is required"),
        label: Yup.string().required("services is required"),
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
      //console.log("Form Submitted:", values);
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
        formData.append("sanitationStatus", sanitationStatus);
        formData.append("isAvailable", isAvailable);
        if (values.roomImage) formData.append("roomImage", values.roomImage);

        await axios.put(`api/v1/rooms/edit-room/${room.id}`, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Room updated successfully");
        resetForm();
        setRoomImagePreview(null);
        setRefreshPage(Math.random());
        setIsEditOpen(false);
        setRoomImageError("");
        dispatch(hideLoading());
      } catch (error) {
        dispatch(hideLoading());
        // toast.error(error.response?.data?.message || "An error occurred");
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
    <PopContent>
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
            getOptionLabel={(servicesList) => servicesList.label}
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
            label="Sanitation Period"
            name="sanitationPeriod"
            margin="normal"
            type="number"
            value={formik.values.sanitationPeriod}
            onChange={formik.handleChange}
            error={
              formik.touched.sanitationPeriod &&
              Boolean(formik.errors.sanitationPeriod)
            }
            helperText={
              formik.touched.sanitationPeriod && formik.errors.sanitationPeriod
            }
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
            onChange={handleRoomImageChange}
          />
          <label htmlFor="room-image-upload">
            <IconButton component="span" color="primary">
              <PhotoCameraIcon fontSize="medium" />
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
        <FormButton type="submit" btnName={'Save'} />
      </Box>
    </PopContent>
  );
};

export default EditRoomForm;
