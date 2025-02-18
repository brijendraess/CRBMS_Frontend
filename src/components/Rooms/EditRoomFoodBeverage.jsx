import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { PopContent } from "../../Style";
import FormButton from "../Common/Buttons/FormButton/FormButton";

const EditRoomFoodBeverage = ({
  room,
  setRefreshPage,
  setOpenEdit,
  editId,
  editInfo,
}) => {
  const { user } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    foodBeverageId: editInfo?.foodBeverageId,
    quantity: editInfo?.quantity,
    roomId: room.id,
    updatedBy: user.id,
  });
  const [amenitiesList, setAmenitiesList] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // Dynamically update the correct key
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      showLoading();
      const response = await axios.put(
        `api/v1/rooms/edit-food-beverage/${editId}`,
        formData
      );
      toast.success("Food beverage updated Successfully");
      setRefreshPage(Math.random());
      hideLoading();
    } catch (err) {
      // toast.error(err.response?.data?.message || "An error occurred");
      console.error("Error adding Food beverage:", err);
      hideLoading();
    } finally {
      setOpenEdit(false);
      hideLoading();
    }
  };

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        showLoading();
        const response = await axios.get(
          "api/v1/food-beverages/active-food-beverage"
        );
        const foodBeverage = response.data.data.result.map((foodBeverage) => {
          return { id: foodBeverage.id, label: foodBeverage.foodBeverageName };
        });
        setAmenitiesList(foodBeverage);
        hideLoading();
      } catch (error) {
        // toast.error("Failed to load food beverage");
        console.error("Error fetching food beverage:", error);
        hideLoading();
      }
    };

    fetchAmenities();
  }, []);

  return (
    <PopContent>
      <Box
        component="form"
        onSubmit={handleSubmit}
      >
        <FormControl
          size="small"
          fullWidth
        >
          <InputLabel id="demo-multiple-name-label">Food & Beverage</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="foodBeverageId"
            name="foodBeverageId"
            value={formData.foodBeverageId}
            label="Food & Beverage"
            required
            size="small"
            onChange={handleChange}
            sx={{
              marginBottom: '8px'
            }}
          >
            {amenitiesList.map((foodBeverage) => (
              <MenuItem value={foodBeverage.id}>{foodBeverage.label}</MenuItem>
            ))}
          </Select>
          <FormButton type="submit" func={() => handleSubmit()} btnName={'Save'} />
        </FormControl>
      </Box>
    </PopContent>
  );
};

export default EditRoomFoodBeverage;
