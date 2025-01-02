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
      quantity: "",
    },
    validationSchema: Yup.object({
      foodBeverageId: Yup.string().required("Please select a food or beverage"),
      quantity: Yup.number()
        .required("Quantity is required")
        .min(1, "Quantity must be at least 1")
        .typeError("Quantity must be a number"),
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
        toast.error("Failed to load food or beverages");
        console.error("Error fetching food beverages:", error);
      } finally {
        hideLoading();
      }
    };

    fetchFoodBeverage();
  }, []);

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
        <FormControl
          sx={{ m: 1, width: "100%" }}
          error={
            !!formik.errors.foodBeverageId && formik.touched.foodBeverageId
          }
        >
          <InputLabel id="food-beverage-select-label">
            Food & Beverage Name
          </InputLabel>
          <Select
            labelId="food-beverage-select-label"
            id="foodBeverageId"
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

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Add
        </Button>
      </Box>
    </div>
  );
};

export default AddRoomFoodBeverage;
