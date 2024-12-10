import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const LocationEdit = ({ id, locationName, onSuccess,setRefreshPage,setIsEditOpen }) => {
  const [formData, setFormData] = useState({
    name: locationName || "",
  });

  useEffect(() => {
    setFormData({ name: locationName || "" });
  }, [locationName]);

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`/api/v1/location/locations/${id}`, {
        name: formData.name,
      });
      toast.success("Location Updated Successfully");
      setRefreshPage(Math.random())
      setIsEditOpen(false)
      if (onSuccess) {
        onSuccess(response.data.data.location);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update location!";
      toast.error(errorMessage);
      console.error("Error updating location:", error);
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
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
          size="small"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Update
        </Button>
      </Box>
    </div>
  );
};

export default LocationEdit;
