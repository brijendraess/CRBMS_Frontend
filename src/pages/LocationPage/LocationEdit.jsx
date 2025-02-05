import { Avatar, Box, Button, IconButton, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PhotoCameraIcon } from "../../components/Common/Buttons/CustomIcon";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PopContent } from "../../Style";
import FormButton from "../../components/Common/Buttons/FormButton/FormButton";

const LocationEdit = ({
  id,
  locationName,
  locationImagePath,
  onSuccess,
  setRefreshPage,
  setIsEditOpen,
}) => {

  const [locationImagePreview, setLocationImagePreview] = useState(
    locationImagePath || null
  );
  const [locationImage, setLocationImage] = useState(null);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: locationName || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Location name is required")
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must be at most 50 characters"),
    }),
    onSubmit: async (values) => {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("name", values.name);

      if (locationImage) {
        formDataToSubmit.append("locationImage", locationImage);
      }

      try {
        showLoading();
        const response = await axios.put(
          `/api/v1/location/locations/${id}`,
          formDataToSubmit,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Location updated successfully!");
        setRefreshPage(Math.random());
        setIsEditOpen(false);
        if (onSuccess) {
          onSuccess(response.data.data.location);
        }
        hideLoading();
      } catch (error) {
        hideLoading();
        const errorMessage =
          error.response?.data?.message || "Failed to update location!";
        // toast.error(errorMessage);
        console.error("Error updating location:", error);
      }
    },
  });

  // Handle image change
  const handleLocationImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLocationImage(file); // Save the selected file
      setLocationImagePreview(URL.createObjectURL(file)); // Show preview
    }
  };

  return (
    <PopContent>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
      >
        <TextField
          label="Location Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          fullWidth
          margin="normal"
          size="small"
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
            onChange={handleLocationImageChange}
          />
          <label htmlFor="room-image-upload">
            <IconButton component="span">
              <Avatar
                sx={{ width: 75, height: 75 }}
                src={
                  `${import.meta.env.VITE_API_URL}/${locationImagePath}` ||
                  undefined
                }
                alt="Location Image Preview"
              >
                {!locationImagePreview && <PhotoCameraIcon fontSize="medium" />}
              </Avatar>
            </IconButton>
          </label>
        </Box>
        <FormButton
          type="submit"
          btnName={"Update Location"}
        />

      </Box>
    </PopContent>
  );
};

export default LocationEdit;
