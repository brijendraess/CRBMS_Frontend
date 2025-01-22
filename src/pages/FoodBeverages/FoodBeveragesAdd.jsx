import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../../Redux/alertSlicer";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";

const FoodBeverageAdd = ({ setRefreshPage, setIsAddOpen }) => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      name: "", // Initial value for the field
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Food beverage name is required")
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must be at most 50 characters"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        dispatch(showLoading());
        await axios.post("api/v1/food-beverages/food-beverage", values);
        toast.success("Food beverage added Successfully");
        resetForm(); // Reset form after successful submission
        setRefreshPage(Math.random());
        setIsAddOpen(false);
        dispatch(hideLoading());
      } catch (err) {
        dispatch(hideLoading());
        toast.error(err.response?.data?.message || "An error occurred");
        console.error("Error adding foodBeverage:", err);
      }
    },
  });

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
        <TextField
          label="Food beverage Name"
          name="name" // Field name must match Formik's initialValues
          value={formik.values.name} // Managed by Formik
          onChange={formik.handleChange} // Managed by Formik
          onBlur={formik.handleBlur} // Tracks field's touch state
          error={formik.touched.name && Boolean(formik.errors.name)} // Show error if touched and invalid
          helperText={formik.touched.name && formik.errors.name} // Display validation error
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
          Add Food beverage
        </Button>
      </Box>
    </div>
  );
};

export default FoodBeverageAdd;
