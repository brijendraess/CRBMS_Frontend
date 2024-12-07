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
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import axios from "axios";
import toast from "react-hot-toast";

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

const EditRoomForm = () => {
  const [roomImagePreview, setRoomImagePreview] = useState(null);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [roomImageError, setRoomImageError] = useState("");

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

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await axios.get("api/v1/amenity/get-all-amenities");
        const amenities = response.data.data.roomAmenities.map(
          (amenity) => amenity.name
        );
        setAmenitiesList(amenities);
      } catch (error) {
        toast.error("Failed to load amenities");
        console.error("Error fetching amenities:", error);
      }
    };

    fetchAmenities();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      location: "",
      capacity: "",
      roomImage: "",
      // password: "",
      description: "",
      sanitationStatus: false,
      isAvailable: true,
      amenities: [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Room Name is required"),
      location: Yup.string().required("Location is required"),
      capacity: Yup.number()
        .required("Capacity is required")
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
        formData.append("location", values.location);
        formData.append("capacity", values.capacity);
        formData.append("description", values.description);
        // formData.append("password", values.password);
        formData.append("amenities", JSON.stringify(values.amenities));
        if (values.roomImage) formData.append("roomImage", values.roomImage);

        const response = await axios.post("api/v1/rooms/add-room", formData, {
          withCredentials: true,
        });

        toast.success("Room added successfully");
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

  return (
    <div className="pop-content w-100">
      <FormWrapper>
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
            <TextField
              label="Location"
              name="location"
              margin="normal"
              value={formik.values.location}
              onChange={formik.handleChange}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
              style={{ flex: 1 }}
              size="small"
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
              // value={formik.values.Sanitation Time}
              onChange={formik.handleChange}
              // error={formik.touched.Sanitation Time && Boolean(formik.errors.Sanitation Time)}
              // helperText={formik.touched.Sanitation Time && formik.errors.Sanitation Time}
              size="small"
              style={{ marginRight: 8, flex: 1 }}
            />
          </Box>
          <TextField
            label="Description"
            name="description"
            margin="normal"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
            size="small"
            // style={{ flex: 1 }}
            multiline
            rows={3}
            fullWidth
            style={{ marginBottom: 16 }}
          />
          <Autocomplete
            multiple
            id="amenities"
            name="amenities"
            size="small"
            options={amenitiesList}
            value={formik.values.amenities}
            onChange={(_, newValue) =>
              formik.setFieldValue("amenities", newValue)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Amenities"
                error={
                  formik.touched.amenities && Boolean(formik.errors.amenities)
                }
                helperText={formik.touched.amenities && formik.errors.amenities}
              />
            )}
            disableCloseOnSelect
            isOptionEqualToValue={(option, value) => option === value}
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
              Save
            </Button>
          </Box>
        </Box>
      </FormWrapper>
    </div>
  );
};

export default EditRoomForm;
