import { Avatar, Box, Button, IconButton, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { PhotoCameraIcon } from "../../components/Common Components/CustomButton/CustomIcon";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { useFormik } from "formik";
import * as Yup from "yup";

const LocationAdd = ({ setRefreshPage, setIsAddOpen }) => {
  const [locationImagePreview, setLocationImagePreview] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      locationImage: null,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Location name is required")
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must be at most 50 characters"),
      locationImage: Yup.mixed()
        .required("Please upload a location image")
        .test(
          "fileType",
          "Only image files are allowed",
          (value) =>
            value &&
            [
              "image/jpeg",
              "image/png",
              "image/jpg",
              "image/heic",
              "image/heif",
              "image/dng",
              "image/webp",
              "image/tiff",
              "image/bmp",
              "image/gif",
            ].includes(value.type)
        )
        .test(
          "fileSize",
          "File size should be less than 2MB",
          (value) => value && value.size <= 2 * 1024 * 1024
        ),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("name", values.name);
      formDataToSubmit.append("locationImage", values.locationImage);

      try {
        showLoading();
        const response = await axios.post(
          "api/v1/location/locations",
          formDataToSubmit,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Location added successfully!");
        resetForm();
        setLocationImagePreview(null);
        setRefreshPage(Math.random());
        setIsAddOpen(false);
        hideLoading();
      } catch (err) {
        hideLoading();
        toast.error(err.response?.data?.message || "An error occurred");
        console.error("Error adding location:", err);
      }
    },
  });

  const handleLocationImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("locationImage", file);
      setLocationImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="pop-content w-100">
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          maxWidth: 500,
          margin: "auto",
          borderRadius: 3,
        }}
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
                sx={{ width: 50, height: 50 }}
                src={locationImagePreview || undefined}
                alt="Location Image Preview"
              >
                {!locationImagePreview && <PhotoCameraIcon fontSize="medium" />}
              </Avatar>
            </IconButton>
          </label>
        </Box>
        {formik.errors.locationImage && (
          <Box color="error.main" textAlign="center" mb={2}>
            {formik.errors.locationImage}
          </Box>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Add Location
        </Button>
      </Box>
    </div>
  );
};

export default LocationAdd;
