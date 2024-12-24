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

const AddRoomFoodBeverage = ({
  room,
  setRefreshPage,
  setIsFoodBeverageOpen,
}) => {
  const { user } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    foodBeverageId: "",
    quantity: "",
    roomId: room.id,
    status: true,
    createdBy: user.id,
  });
  const [FoodBeveragesList, setFoodBeverageList] = useState([]);

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
      const response = await axios.post(
        "api/v1/rooms/add-food-beverage",
        formData
      );
      toast.success("Food & Beverage added Successfully");
      setRefreshPage(Math.random());
      hideLoading();
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
      console.error("Error adding location:", err);
      hideLoading();
    } finally {
      setIsFoodBeverageOpen(false);
      hideLoading();
    }
  };

  useEffect(() => {
    const fetchFoodBeverage = async () => {
      try {
        showLoading();
        const response = await axios.get(
          "api/v1/food-beverages/active-food-beverage"
        );
        const FoodBeverages = response.data.data.result?.map((foodBeverage) => {
          return { id: foodBeverage.id, label: foodBeverage.foodBeverageName };
        });
        setFoodBeverageList(FoodBeverages);
        hideLoading();
      } catch (error) {
        toast.error("Failed to load food beverage");
        console.error("Error fetching food beverage:", error);
        hideLoading();
      }
    };

    fetchFoodBeverage();
  }, []);

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
        <FormControl sx={{ m: 1, width: "100%" }}>
          <InputLabel id="demo-multiple-name-label">
            Food Beverage Name
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="foodBeverageId"
            name="foodBeverageId"
            value={formData.foodBeverageId}
            label="Food Beverage Name"
            required
            size="small"
            onChange={handleChange}
          >
            {FoodBeveragesList.map((foodBeverage) => (
              <MenuItem value={foodBeverage.id}>{foodBeverage.label}</MenuItem>
            ))}
          </Select>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={() => handleSubmit()}
            fullWidth
            sx={{ mt: 2 }}
          >
            Add
          </Button>
        </FormControl>
      </Box>
    </div>
  );
};

export default AddRoomFoodBeverage;
