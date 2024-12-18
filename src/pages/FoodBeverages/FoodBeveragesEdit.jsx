import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const FoodBeverageEdit = ({ id, foodBeverageName, onSuccess,setRefreshPage,setIsEditOpen }) => {
  const [formData, setFormData] = useState({
    name: foodBeverageName || "",
  });

  useEffect(() => {
    setFormData({ name: foodBeverageName || "" });
  }, [foodBeverageName]);

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`/api/v1/food-beverages/food-beverage/${id}`, {
        name: formData.name,
      });
      toast.success("Food beverage Updated Successfully");
      setRefreshPage(Math.random())
      setIsEditOpen(false)
      if (onSuccess) {
        onSuccess(response.data.data.foodBeverage);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update foodBeverage!";
      toast.error(errorMessage);
      console.error("Error updating foodBeverage:", error);
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
          label="Food beverage Name"
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

export default FoodBeverageEdit;
