import { Avatar, Box, Button, IconButton, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { PhotoCameraIcon } from "../../components/Common Components/CustomButton/CustomIcon";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";

const LocationAdd = ({ setRefreshPage, setIsAddOpen }) => {
  const [formData, setFormData] = useState({
    name: "",
  });

  const [locationImage, setLocationImage] = useState(null);
  const [locationImagePreview, setLocationImagePreview] = useState(null);

  // Handle image selection
  const handleLocationImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLocationImage(file);
      setLocationImagePreview(URL.createObjectURL(file)); // Create a preview URL
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // Dynamically update the correct key
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Location name is required!");
      return;
    }

    if (!locationImage) {
      toast.error("Please upload a location image!");
      return;
    }

    // Prepare data for submission
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.name); // Add location name
    formDataToSubmit.append("locationImage", locationImage); // Add image file

    try {
      showLoading();
      const response = await axios.post(
        "api/v1/location/locations",
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Required for file uploads
          },
        }
      );
      console.log(response);

      toast.success("Location added successfully!");
      setFormData({ name: "" }); // Reset input field
      setLocationImage(null); // Reset image
      setLocationImagePreview(null); // Reset preview
      setRefreshPage(Math.random()); // Trigger parent component refresh
      setIsAddOpen(false); // Close modal
      hideLoading();
    } catch (err) {
      hideLoading();
      toast.error(err.response?.data?.message || "An error occurred");
      console.error("Error adding location:", err);
    }
  };

  return (
    <div className="pop-content w-100">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 500,
          margin: "auto",
          borderRadius: 3,
        }}
      >
        <TextField
          label="Location Name"
          name="name" // Match the key in formData
          value={formData.name} // Access the correct value
          onChange={handleChange}
          fullWidth
          required
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
