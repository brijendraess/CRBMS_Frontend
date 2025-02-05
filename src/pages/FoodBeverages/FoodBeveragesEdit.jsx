import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PopContent } from "../../Style";
import FormButton from "../../components/Common/Buttons/FormButton/FormButton";

const FoodBeverageEdit = ({
  id,
  foodBeverageName,
  onSuccess,
  setRefreshPage,
  setIsEditOpen,
}) => {
  const formik = useFormik({
    initialValues: {
      name: foodBeverageName || "",
    },
    enableReinitialize: true, // Allows reinitialization when `foodBeverageName` changes
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Food beverage name is required")
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must be at most 50 characters"),
    }),
    onSubmit: async (values) => {
      try {
        showLoading();
        const response = await axios.put(
          `/api/v1/food-beverages/food-beverage/${id}`,
          { name: values.name }
        );
        toast.success("Food beverage Updated Successfully");
        setRefreshPage(Math.random());
        setIsEditOpen(false);
        if (onSuccess) {
          onSuccess(response.data.data.foodBeverage);
        }
        hideLoading();
      } catch (error) {
        hideLoading();
        const errorMessage =
          error.response?.data?.message || "Failed to update foodBeverage!";
        // toast.error(errorMessage);
        console.error("Error updating foodBeverage:", error);
      }
    },
  });

  return (
    <PopContent>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          maxWidth: 500,
          margin: "auto",
          borderRadius: 3,
        }}
      >
        <TextField
          label="Food beverage Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          fullWidth
          required
          margin="normal"
          size="small"
        />
        <FormButton type='submit' btnName='Update' />
      </Box>
    </PopContent>
  );
};

export default FoodBeverageEdit;
