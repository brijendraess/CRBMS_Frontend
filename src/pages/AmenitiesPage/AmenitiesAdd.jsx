import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Paper, styled } from "@mui/material";
import toast from "react-hot-toast";

const AmenitiesAdd = ({ setIsRefreshed, setIsAddOpen, isRefreshed }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: 1,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuantityChange = (amount) => {
    setFormData((prevData) => ({
      ...prevData,
      quantity: Math.max(1, prevData.quantity + amount), // Ensure quantity is at least 1
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("api/v1/amenity/add-amenity", formData);
      toast.success("Amenity added Successfully");
      setFormData({ name: "", description: "", quantity: 1 });
      setIsRefreshed(!isRefreshed);
      setIsAddOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message);
      console.error("Error adding amenity:", err);
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
          label="Amenity Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          size="small"
        />
        <TextField label="Quantity" name="quantity" value={1} hidden={true} />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          multiline
          rows={4}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Add Amenity
        </Button>
      </Box>
    </div>
  );
};

export default AmenitiesAdd;
