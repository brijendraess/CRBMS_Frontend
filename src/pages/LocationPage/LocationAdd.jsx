import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const LocationAdd = () => {
  const [formData, setFormData] = useState({
    name: "", // Key must match the name attribute of the TextField
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // Dynamically update the correct key
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("api/v1/location/locations", formData);
      toast.success("Location added Successfully");
      setFormData({ name: "" }); // Reset formData after submission
    } catch (err) {
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
