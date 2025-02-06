import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { PopContent } from "../../Style";
import FormButton from "../Common/Buttons/FormButton/FormButton";

const AddRoomFoodBeverage = ({
  room,
  setRefreshPage,
  setIsFoodBeverageOpen,
}) => {
  const { user } = useSelector((state) => state.user);
  const [FoodBeveragesList, setFoodBeverageList] = useState([]);

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      foodBeverageId: "",
    },
    validationSchema: Yup.object({
      foodBeverageId: Yup.string().required("Please select a food or beverage"),

    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        showLoading();
        const formData = {
          ...values,
          roomId: room.id,
          status: true,
          createdBy: user.id,
        };
        await axios.post("api/v1/rooms/add-food-beverage", formData);
        toast.success("Food & Beverage added successfully");
        setRefreshPage(Math.random());
        resetForm(); // Clear form fields
      } catch (err) {
        toast.error(err.response?.data?.message || "An error occurred");
        console.error("Error adding food or beverage:", err);
      } finally {
        setIsFoodBeverageOpen(false);
        hideLoading();
      }
    },
  });

  useEffect(() => {
    const fetchFoodBeverage = async () => {
      try {
        showLoading();
        const response = await axios.get(
          "api/v1/food-beverages/active-food-beverage"
        );
        const FoodBeverages = response.data.data.result?.map(
          (foodBeverage) => ({
            id: foodBeverage.id,
            label: foodBeverage.foodBeverageName,
          })
        );
        setFoodBeverageList(FoodBeverages);
      } catch (error) {
        // toast.error("Failed to load food or beverages");
        console.error("Error fetching food beverages:", error);
      } finally {
        hideLoading();
      }
    };

    fetchFoodBeverage();
  }, []);

  return (
    <PopContent>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}

      >
        <FormControl
          error={
            !!formik.errors.foodBeverageId && formik.touched.foodBeverageId
          }
          size="small"
          fullWidth
          sx={{
            marginBottom: '8px'
          }}
        >
          <InputLabel id="food-beverage-select-label">
            Food & Beverage
          </InputLabel>
          <Select
            label="Food & Beverage"
            labelId="food-beverage-select-label"
            id="foodBeverage"
            name="foodBeverageId"
            value={formik.values.foodBeverageId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            size="small"
            required
          >
            {FoodBeveragesList.map((foodBeverage) => (
              <MenuItem key={foodBeverage.id} value={foodBeverage.id}>
                {foodBeverage.label}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.foodBeverageId && formik.errors.foodBeverageId && (
            <p style={{ color: "red", fontSize: "0.875rem" }}>
              {formik.errors.foodBeverageId}
            </p>
          )}
        </FormControl>
        <FormButton type="submit" btnName="Add" />
      </Box>
    </PopContent>
  );
};

export default AddRoomFoodBeverage;
